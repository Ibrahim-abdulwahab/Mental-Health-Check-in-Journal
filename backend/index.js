const express= require("express");
const mongoose = require("mongoose");
const cors = require('cors');


//loading the .env variables
require("dotenv").config();


const app=express();


//the auth routes
const authRoutes = require('./src/routes/auth');

//Middleware
app.use(cors());
app.use(express.json());
//routes middleware
app.use('/api/auth', authRoutes);

//Global error handling middleware
app.use((err, req , res , next) =>{
    console.error("Global error handler:", err);
    res.status(500).json({message: "An unexpected error occurred!"});
})

//Mongoose Validation error
if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ message: errors.join(', ') });
    }

//Duplicate key error
if(err.code ===11000){
    return res.status(409).json({
        status : "fail",
        message: "Duplicate field value entered",
        field: Object.keys(err.keyvalue)[0],
        value: Object.values(err.keyvalue)[0]
    });
}

//Generic fallback
res.status(err.status || 500).json({
    status: "error",
    message : err.message || "Internal Server Error"

})
//Running the server 
// define the port
const PORT=process.env.PORT || 5000;

// to connect to the mongoDB database
mongoose
.connect(process.env.MONGOURL)
.then(()=>console.log("MongoDB Connected"))
.catch((err)=>console.log(err));

app.listen(PORT,()=>{
    console.log("Server is running on port " + PORT);
})