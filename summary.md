# DebugIt Project Summary

This document serves as a detailed breakdown of what was built for the **DebugIt** platform, how the architecture was designed, and the underlying logic powering its core features.

## 1. Core Architecture & Philosophy
DebugIt is a **MERN stack** application (MongoDB, Express, React, Node.js) heavily focused on **gamification**. The goal was to build a platform that incentivizes developers to help each other by rewarding them with XP, rankings, and visibility.

To achieve a seamless user experience, the frontend uses a highly modular React component structure styled with Tailwind CSS, utilizing `Context API` for global state (Auth and Search). The backend acts as a robust JSON API, protected by JWT middleware, and relies on Mongoose schemas to maintain complex relationships between Users, Posts, and Solutions.

---

## 2. Gamification Logic (XP & Rankings)

The heart of DebugIt is its ranking system. Instead of storing a static `XP` number on the user document that requires constant manual updating, the platform dynamically calculates XP using **MongoDB Aggregation Pipelines**.

### How it works:
1. **The Solution Schema**: When a user comments on a post, a sub-document is added to the Post's `solutions` array.
2. **The Rating System**: Other users can rate that solution (1-5 stars). 
3. **The Aggregation Pipeline** (`/api/users/leaderboard`):
   - The backend searches every single post in the database.
   - It unwinds the `solutions` array and groups them by the `author` of the solution.
   - It calculates the total sum of `stars` they have received across all their solutions.
   - 1 Star = 10 XP.
   - It also counts how many of their solutions have `isAccepted: true`.
   - It sorts the final array descending by `totalStars` to generate the global Leaderboard.

This ensures data integrity—if a post is deleted, the XP is automatically and accurately adjusted without running complex cleanup scripts.

---

## 3. Real-Time Chat & Online Presence

To facilitate live debugging sessions, **Socket.io** is heavily integrated into the platform.

### Chat Rooms:
- When a user logs in, the `AuthContext` immediately establishes a WebSocket connection and emits a `setup` event with their User ID.
- The server joins them to a personal "Room" matching their User ID.
- When User A sends a message to User B, it is saved to MongoDB via a REST API, and then broadcast directly to User B's personal Room via Socket.io for instant UI updates.

### Online Status Tracking:
- The Node.js server maintains a `Map` of connected User IDs in memory.
- It handles edge cases (like a user having multiple browser tabs open) by incrementing/decrementing a connection count.
- The server broadcasts an `online users` array to all connected clients.
- The React frontend listens to this array and dynamically renders "Online" or "Offline" text (with green indicators) in the Chat UI.

### Global Notification Engine & Read Receipts:
- The `AuthContext` component acts as the global switchboard. It mounts immediately upon login, fetching initial counts for both Unread Notifications and Unread Chats.
- We utilize `messageModel.distinct('chatId')` to efficiently calculate how many unique conversations require the user's attention, avoiding bloated counts if one user spam-messages them.
- When the `postController` or `chatController` processes an interaction (like, star, accept, message), it directly accesses the globally stored `Socket.io` instance (`req.app.get('socketio')`) to push targeted JSON payloads to the specific recipient's socket room in real-time.

---

## 4. Frontend Component Highlights

- **`PostItem.jsx`**: The most versatile component in the app. It is reused in the Main Feed, Explore Tab, User Profile, and Saved Posts. It gracefully handles conditional rendering (e.g., only showing the "Delete" button if the logged-in user is the author, and only allowing the original author to "Accept" a solution).
- **Dynamic Routing**: Pages like `UserProfile.jsx` and `MyProfile.jsx` use nested tabs (My Posts, Solutions) that dynamically fetch only the data relevant to that specific view, minimizing initial load times.
- **The "Explore" Page**: A clever repurposing of existing APIs. The "Unsolved Bugs" tab simply fetches all posts and filters out anything where `isResolved === true`, creating an instant "Bounty Board" for developers looking for XP.
- **Scalable Feed Pagination**: To prevent memory leaks or crashes from rendering massive datasets, `Post.jsx` uses an additive local state model. The backend serves chunks of 10 posts (`limit(10).skip(...)`), which the frontend appends to its `postData` array when the user manually requests more.

---

## 5. Account Management & Security

- **Authentication**: JWT tokens are securely stored in `localStorage` and sent via Bearer headers on every protected API request.
- **Change Password**: Handled via `bcrypt.compare` to ensure the user knows their current password before allowing a change.
- **Cascading Deletions**: MongoDB does not natively support SQL-like `ON DELETE CASCADE`. Therefore, the `deleteAccount` API manually executes a series of highly efficient `deleteMany` and `$pull` update operations to scrub the user's authored posts, comments, ratings, and associated notifications. This maintains a pristine database schema over time without accumulating "ghost" data.
