const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Person = require('../models/personSchema');
const validator = require('validator');

//Signup controller for a new user

exports.signUp = async(req, res , next) =>{
    try{


        //----------normalize the inputs and simple validations-----------
        const {name, email, password, role, roleSecret} = req.body;
        
        //validating the input fields
        if (!name || !email || !password){
            return res.status(400).json({message: "Name, email and password are required"});
        }
        //validating the name entered
        if (name.length <= 2 || name.length > 50){
            return res.status(400).json({message :"Name must be at least 2 characters"});
        }
        //validating the email entered
         if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
     }
     if (password.length < 8){
        return res.status(400).json({message: "Password must be at least 8 characters long"});
        }


        //----------Protect elevated roles with secrets-----------
    if (['professional', 'admin'].includes(role)) {
      const expected =
        role === 'admin'
          ? process.env.ADMIN_SIGNUP_SECRET
          : process.env.PROFESSIONAL_SIGNUP_SECRET;

      if (!expected || roleSecret !== expected) {
         return res.status(403).json({ message: `Invalid or missing roleSecret for role "${role}".` });
      }
    }

    //---check if the user already exists---
    const currentUser = await Person.findOne({email});
    if (currentUser){
        return res.status(409).json({message: "User with this email already exists"});
    }

    //------------hashing the password-------------------
    const passwordHash = await bcrypt.hash(password, 12);


    //----------create a new user-------------------
    const newUser = new Person({
        name,
        email,
        passwordHash,
        role: role || 'user' //default role is user
    });
    await newUser.save();
    res.status(201).json({message: "User registered successfully"});
    res.status(201).json({
    personId: newUser.personId,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    createdAt: newUser.createdAt
});
    }catch(err){
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
}}