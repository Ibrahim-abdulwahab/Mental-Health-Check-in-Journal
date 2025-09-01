const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Person = require('../models/personSchema');
const validator = require('validator');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;



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
    res.status(201).json({
  message: "User registered successfully",
  person: {
    personId: newUser._id, // or newUser.personId if you defined it
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    createdAt: newUser.createdAt
  }
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
                field: Object.keys(err.keyValue)[0],
                value: Object.values(err.keyValue)[0]
            });
        }
}}
//Login controller for existing user
exports.login = async(req, res, next) =>{
    try{
        const {email, password} = req.body;
        //validating the input fields
        if (!email || !password){
            return res.status(400).json({message: "Email and password are required"});
        }
        //validating the email entered
         if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
     }
        if (password.length < 8){
        return res.status(400).json({message: "Password must be at least 8 characters long"});
        }
        //check if the user exists
        const existingUser = await Person.findOne({email});
        if (!existingUser){
            return res.status(401).json({message: "Invalid email or password"});
        }
        //compare the password
        const isMatch = await bcrypt.compare(password, existingUser.passwordHash);
        if (!isMatch){
            return res.status(401).json({message: "Invalid email or password"});
        }
           // 3. Generate tokens
    const payload = { userId: user._id, role: existingUser.role };
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        // 4. Send response
    res.json({
      accessToken,
      refreshToken,
      user: {
        userId: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role
      }
    });

    }catch(err){
        next(err);
    }
}   