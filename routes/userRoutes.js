const express = require("express");
const router = express.Router();
const User = require("../schemas/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("dotenv");
env.config();


//sign in -> user puts their credentials -> look for existing user -> if user exists -> tell them email already taken -> if not -> create a new user in mongodb -> send back a jwt token 

router.post("/signup", async (req,res) => {
    
    try{
        const {email, password,name,phone} = req.body;
        const isUserExist = await User.findOne({email})

        if(isUserExist){
            return res.status(400).json({message: "Email already taken"})
        }else{
            const hashedPassword = bcrypt.hashSync(password, 10);
            const newUser = await new User({email, password:hashedPassword,name,phone}).save();
            const token = jwt.sign({email}, process.env.JWT_SECRET)
            return res.status(200).json({message: "user created sucessfully",token,id:newUser._id});
        }
    }catch(err){
      res.status(500).json({message:"server error"});
    }
})

router.post("/signin",async (req,res) => {

    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid email or password"})
        }
        const isPasswordMatch = await bcrypt.compareSync(password,user.password);
        if(!isPasswordMatch){
            return res.status(400).json({message: "Invalid email or password"})
         }
         const token = jwt.sign({email}, process.env.JWT_SECRET)
         return res.status(200).json({message: "user logged in sucessfully",token,id:user._id})
    }catch(err){
        res.status(500).json({message:"server error"});
    }
})


module.exports = router;
