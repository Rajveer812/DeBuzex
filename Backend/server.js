const express =require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors= require('cors');
const cookieParser = require('cookie-parser')



dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser())

app.get('/',(req,res)=>{
  res.cookie("name","harsh");
  res.send('Debuzzer is running');
  console.log('Cookies: ', req.cookies)
    
})
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});