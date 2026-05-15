require('dotenv').config();
const express =require('express');
const cors= require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
const postRoute = require('./routes/postRoute')
const chatRoute = require('./routes/chatRoute')
const messageRoute= require('./routes/messageRoute')

connectDB();// connect db
const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/post',postRoute)
app.use('/api/chat',chatRoute)
app.use('/api/message',messageRoute)



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});