const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("MongoDB Connected");
}).catch(err=> console.log(err));

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

app.use("/auth",authRoutes);
app.use("/tasks",taskRoutes);

app.get("/",(req,res)=> res.send("Task Manager API Runnning"));


const PORT = process.env.PORT||3000;
app.listen(PORT,()=>console.log(`server Running on port ${PORT}`));