const {userModel}=require('../models/userModel');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const asyncHandler=require('express-async-handler');

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'5d'
    });
};

const registerUser=asyncHandler(async(req,res)=>{
        const{name,username,email,password}=req.body;
        // Check if user already exists in the database
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User with this email already exists" });
        }
        // Create and save the new user
        const newUser = await userModel.create({
            name,
            username,
            email,
            password
        });
        //  Send a success response back to the frontend
        res.status(201).json({
            message: "User registered successfully!",
            user: {
                _id: newUser._id,
                name: newUser.name,        
                username: newUser.username,
                email: newUser.email,
                bio: newUser.bio,          
                profilePic: newUser.profilePic,
                token: generateToken(newUser._id)
            }
        }); 
});

const loginUser=asyncHandler(async(req,res)=>{
        const {email,password}=req.body;
        const user = await userModel.findOne({ email });
        if(user&& (await bcrypt.compare(password,user.password))){
            res.status(200).json({
                message: "Login successful!",
                user: {
                _id: user._id,
                name: user.name,           
                username: user.username,
                email: user.email,
                bio: user.bio,            
                profilePic: user.profilePic,
                token: generateToken(user._id)
                }
            });
        }else{
            res.status(401).json({message:"Invalid email or password"}) 
        }
});

module.exports={registerUser,loginUser};