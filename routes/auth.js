const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();


//signup 
router.post("/signup",async(req,res)=>{
    try{
        const {username,password} = req.body;
        const hashed = await bcrypt.hash(password,10);
        const user = new User({
            username,
            password:hashed
        });
        await user.save();
        res.json({message:"User registered successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({error:"User Registration failed"});
    }
});

//Login
router.post('/login', async(req, res) => {
    try{
        const {username,password} = req.body;
        const user = await User.findOne({username});
        if(!user) return res.status(400).json({error:"User not found"});

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(404).json({error:"Invalid credentials"});
        const token  = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
        res.json({success:true,message:"successfully logged in",token});
        
    }catch(error){
        console.log(error);
        res.status(500).json({error:"Login failed"});
    }
});

module.exports = router;

