const Person = require('../models/personSchema');
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const Invite = require("../models/Invite");


//signup requires: name , email, password(a strong password), role 
exports.signup = async(req,res,next)=>{
    try{
        const role = req.body['role'];
        //------------first validating all the inputs of the recieved request---------------

        //cheking if the email is valid entered by the person
        if(!validator.isEmail(req.body["email"])){
            return res.status(400).json({message:"Invalid email address"});
        }
        //validating the entered name of the user 
        if (req.body["name"].length < 3 ){
            return res.status(400).json({message: "invalid name"});
        }
        //checking the strength of the entered password
        if(req.body["password"].length < 8){
            return res.status(400).json("your password must be at least 8 characters");
        }
        //checking if the password contains upper case letters , numbers , symbols using validator
        if (!validator.isStrongPassword(req.body["password"],{minUppercase: 1, minNumbers:1, minSymbols:1})){
            return res.status(400).json({messsage: "password must contain at least one Upper case letter, a symbol and a number for security reasons"})
        }
        
        //second --checking if the person exists by his email--
         const checkPersonExistance = await Person.findOne({email:req.body["email"]});
         if (checkPersonExistance){
            return res.status(409).json({message:"This person already exists"})
         }

    // --- Hash password ---
    const passwordHash = await bcrypt.hash(req.body["password"], 12);


    
    const newPerson = await Person.create({
      name : req.body["name"],
      email: req.body["email"],
      passwordHash,
      role : req.body["role"],
    });
      const token = jwt.sign(
      { personId: newPerson.personId, role: newPerson.role },
      process.env.JWT_SECRET,
      { expiresIn: '7h' }
    );
    // Send response
       res.status(201).json({
      userId: newPerson.personId,
      token,
      name: newPerson.name,
      email: newPerson.email,
      role: newPerson.role,
      createdAt: newPerson.createdAt
    });

   }catch(err){
        console.log(err);
        res.status(500).json({message: "internal server error"});
        next(err);
    }
};

//to login you need the email and password
exports.login = async (req,res,next)=>{
    try{

        //getting the request params and destructure them
        const {email,password} = req.body;
        //validating the given inputs
        if (!email || !password){
            return res.status(400).json("missing inputs");
        }
        if (!validator.isEmail(email)){
            return res.status(400).json({message: "please enter a valid email"});
        }
        //finding the matching user in the database
        const checkUserExistance = await Person.findOne({email});
        if (!checkUserExistance){
            return res.status(400).json({message: "User is not found"});
        }

        //if the user's email in db check if correct password
        const matchingPassword  = await bcrypt.compare(password, checkUserExistance.passwordHash);
        if (!matchingPassword){
            return res.status(400).json({message: "Invalid Credentials" });
        }
        //sendToken(checkUserExistance, 200, res);
        res.status(200).json({message: "welcome back"})

    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message});
        next(err);
    }
}



