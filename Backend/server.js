require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
const postRoute = require('./routes/postRoute');
const chatRoute = require('./routes/chatRoute');
const messageRoute = require('./routes/messageRoute');
const notificationRoute = require('./routes/notificationRoute');

connectDB(); // connect db
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/post', postRoute);
app.use('/api/chat', chatRoute);
app.use('/api/message', messageRoute);
app.use('/api/notifications', notificationRoute);

const PORT = process.env.PORT || 5000;

// 1. Save the server to a variable so Socket.io can use it
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000, // Closes connection after 60s of inactivity to save bandwidth
  cors: {
    origin: "http://localhost:5173", // CRITICAL: Ensure this matches your React frontend URL!
  },
});

app.set('socketio', io); // Attach io to app so we can access it in controllers!

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔌 A user connected to the Switchboard!");

  // ACTION 1: User logs in, create their personal notification room
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.userId = userData._id; // Attach to socket for cleanup
    
    // Add to online users map (handle multiple tabs for same user)
    const currentCount = onlineUsers.get(userData._id) || 0;
    onlineUsers.set(userData._id, currentCount + 1);

    console.log(`User ${userData.username || 'Unknown'} is online.`);
    
    // Broadcast the full list of online user IDs to EVERYONE
    io.emit("online users", Array.from(onlineUsers.keys()));
    socket.emit("connected");
  });

  // ACTION 2: User opens a specific chat window
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined chat room: " + room);
  });

  // ACTION 3: User sends a text message
  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chatId;

    if (!chat.participants) {
      return console.log("chat.participants not defined");
    }

    // Broadcast message to the OTHER person in the room
    chat.participants.forEach((participant) => {
      // Handle both populated objects and unpopulated ObjectIds
      const participantId = participant._id ? participant._id.toString() : participant.toString();
      
      if (participantId === newMessageReceived.senderId._id.toString()) return; // Don't echo back to sender
      
      socket.in(participantId).emit("message received", newMessageReceived);
    });
  });

  // ACTION 4: Real-time chat requests
  socket.on("new chat request", (targetUserId) => {
    // Notify the target user that they have a new request
    socket.in(targetUserId).emit("chat request received");
  });

  socket.on("chat accepted", (targetUserId) => {
    // Notify the initiator that their request was accepted
    socket.in(targetUserId).emit("chat accepted received");
  });

  // Clean up when the user closes the tab or app
  socket.on("disconnect", () => {
    if (socket.userId) {
      const currentCount = onlineUsers.get(socket.userId);
      if (currentCount <= 1) {
        onlineUsers.delete(socket.userId); // Completely offline
      } else {
        onlineUsers.set(socket.userId, currentCount - 1); // Still has other tabs open
      }
      
      // Update everyone on the new list
      io.emit("online users", Array.from(onlineUsers.keys()));
    }
    console.log("🔌 User Disconnected");
  });
});