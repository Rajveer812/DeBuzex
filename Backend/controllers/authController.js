const {userModel}=require('../models/userModel');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'5d'
    });
};

const registerUser=async(req,res)=>{
    try{
        // 1. Grab the data the user typed in (from Postman/React)
        const{name,username,email,password}=req.body;

        // 2. Validation: Make sure they didn't leave fields blank
        if (!name ||!username || !email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        // 3. Check if user already exists in the database
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User with this email already exists" });
        }
        
        // 4. Create and save the new user
        const newUser = await userModel.create({
            name,
            username,
            email,
            password
        });

        // 5. Send a success response back to the frontend
        res.status(201).json({
            message: "User registered successfully!",
            user: {
                _id: newUser._id,
                name: newUser.name,        // Great job adding this!
                username: newUser.username,
                email: newUser.email,
                bio: newUser.bio,          // <-- ADDED BIO HERE
                profilePic: newUser.profilePic,
                token: generateToken(newUser._id)
            }
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Server error during registration"});
    }
};

const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;

        const user = await userModel.findOne({ email });
        if(user&& (await bcrypt.compare(password,user.password))){
            res.status(200).json({
                message: "Login successful!",
                user: {
                _id: user._id,
                name: user.name,           // <-- ADDED NAME HERE
                username: user.username,
                email: user.email,
                bio: user.bio,             // <-- ADDED BIO HERE
                profilePic: user.profilePic,
                token: generateToken(user._id) // Give them a wristband
                }
            });
        }else{
            // Fixed a small typo here ("Inavlid" -> "Invalid")
            res.status(401).json({message:"Invalid email or password"}) 
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"server error"})
    }
};

module.exports={registerUser,loginUser};