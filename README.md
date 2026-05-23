# 🐛 DebugIt

**DebugIt** is a dynamic, gamified collaborative platform for developers. It allows developers to post their nastiest bugs, solve issues for others, earn XP through a peer-rated system, and climb a real-time global leaderboard from *Novice* to *Grandmaster*.

---

## ✨ Features

### 🎮 Gamified Debugging (XP & Leaderboards)
- **Earn XP**: When you provide a solution to a bug, other users can rate it (1-5 stars). Each star multiplies your total XP!
- **Bug Bounties**: The original author of a bug can "Accept" a solution, marking the bug as resolved and granting a massive boost to the solver's stats.
- **Live Leaderboard**: Real-time ranking system powered by MongoDB aggregation pipelines. Track your progress from Novice (0-100 XP) to Grandmaster (1000+ XP).

### 💬 Real-Time Chat & Presence
- **Socket.io Integration**: Instantly chat with other developers to debug issues live.
- **Online Presence**: See exactly who is currently online in the chat interface via real-time WebSocket broadcasting.
- **Unread Message Badges**: Instantly know when someone reaches out. The global sidebar dynamically tracks how many distinct chats have unread messages waiting for you.

### 🔔 Global Notifications Engine
- **Instant Alerts**: Get real-time WebSocket notifications whenever someone likes your post, stars your solution, accepts your fix, or sends a chat request.
- **Dedicated Notifications Hub**: View your complete history of interactions via a dedicated `/notifications` dashboard with unread tracking.

### 🧭 Exploration & Scalable Feed
- **Unsolved Bugs Feed**: A dedicated "Hunting Ground" to easily find bugs that still need solutions.
- **Dynamic Search & Filtering**: Filter posts by Platform (Windows, macOS, Linux, etc.) and Status (Resolved/Unresolved).
- **Infinite Pagination**: The main feed handles thousands of bugs effortlessly via highly optimized MongoDB `.skip()` and `.limit()` queries and a seamless "Load More" UI.

### 👤 Comprehensive Account Management
- **Dynamic Profiles**: View your exact global rank, total XP, and manage all the posts and solutions you've contributed to.
- **Security & Data Privacy**: Change passwords securely (bcrypt validation) or permanently delete your account. 
- **Cascading Deletes**: When you delete your account, your data isn't left hanging. The backend automatically scrubs all your authored posts, solutions, ratings, and notifications from the platform.

---

## 🛠️ Tech Stack

**Frontend (Client)**
- React (Vite)
- Tailwind CSS
- Lucide React (Iconography)
- Socket.io-client
- Axios

**Backend (Server)**
- Node.js & Express
- MongoDB (Mongoose) - Advanced Aggregation Pipelines
- Socket.io (Real-time web sockets)
- JSON Web Tokens (JWT) & BcryptJS
- Cloudinary (Image Uploads)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js and MongoDB installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DebugIt
   ```

2. **Setup the Backend**
   ```bash
   cd Backend
   npm install
   ```
   Create a `.env` file in the `Backend` directory with your environment variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
   Start the server:
   ```bash
   npm run dev
   ```

3. **Setup the Frontend**
   ```bash
   cd ../Frontend
   npm install
   ```
   Start the development server:
   ```bash
   npm run dev
   ```

4. **Open the App**
   Visit `http://localhost:5173` in your browser!

---

## 📜 License
This project is licensed under the MIT License.
