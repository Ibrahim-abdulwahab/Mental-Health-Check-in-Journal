const mongoose = require('mongoose');
require('dotenv').config();

exports.connectDB = async () =>{
    try{
        //try to connect to the DB
        await mongoose.connect(process.env.MONGBDb_URI);//so that we await the promise that is returned without blocking the processes
        console.log('MongoDB Connected ;)')

    }catch(err){
        //types the error in our terminal and exits the process
        console.log(err);
        process.exit(1);
    }
}