const express = require('express'); //used to create a new app instance(accepting new connection)
const app = express(); //calling express
const DB = require("./database").connectDB; //a pointer to the database so that we can connect to it later
const authRouter = require("../backend/routes/auth");

DB();//connecting to the DB

//middleware: function run automatically without calling on any req,res
app.use(express.json()); //create a middleware that only looks for json data
app.use('/api/auth', authRouter);




app.listen(3000, ()=>{
  console.log("Server is running on port 3000 >'_'<");
}); //listening on port we are using 


