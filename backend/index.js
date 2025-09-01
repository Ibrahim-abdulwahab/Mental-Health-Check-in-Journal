const express= require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const app=express();


// in your .env file create a variable PORT = 5000 
const PORT=process.env.PORT || 5000;

// in your .env file create a variable MONGOURL = (The monodb link that was sent in slack)
mongoose
.connect(process.env.MONGOURL)
.then(()=>console.log("MongoDB Connected"))
.catch((err)=>console.log(err));

app.listen(PORT,()=>{
    console.log("Server is running");
})