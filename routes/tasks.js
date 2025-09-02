const express = require("express");
const jwt = require("jsonwebtoken");
const Task = require("../models/Task");

const router = express.Router();

//Middleware to verify token
function authMiddleWare(req,res,next){
    const token = req.headers["authorization"];
    if(!token) return res.status(401).json({error:"No TOken Provided"});

    jwt.verify(token.split(" ")[1],process.env.JWT_SECRET,(err,decoded)=>{
        if(err) return res.status(403).json({error:"Invalid token"});
        req.userId = decoded.id;
        next();
    });
}

//Adding a task
router.post("/",authMiddleWare,async(req,res)=>{
    const task = new Task({title:req.body.title,user:req.userId});
    await task.save();
    res.json(task);
});

//update tasks
router.put("/:id",authMiddleWare,async(req,res)=>{
    const task  = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true});
    res.json(task);
});

//get task
router.get("/",authMiddleWare,async(req,res)=>{
    const tasks = await Task.find({user:req.userId});
    res.json(tasks);
});

//Delete Task
router.delete("/:id",authMiddleWare,async(req,res)=>{
    await Task.findByIdAndDelete(req.params.id);
    res.json({Message:"Task deleted"});
});

module.exports = router;