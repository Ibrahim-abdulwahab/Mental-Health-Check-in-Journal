const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Person = require('../models/personSchema');
const validator = require('validator');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// ---------------- SIGNUP ----------------
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // --- Input validation ---
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (name.length <= 2 || name.length > 50) {
      return res.status(400).json({ message: "Name must be 3-50 characters" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }
/*
    // --- Protect elevated roles ---
    if (['professional', 'admin'].includes(role)) {
      const expected = role === 'admin'
        ? process.env.ADMIN_SIGNUP_SECRET
        : process.env.PROFESSIONAL_SIGNUP_SECRET;
      if (!expected || roleSecret !== expected) {
        return res.status(403).json({ message: `Invalid or missing roleSecret for role "${role}".` });
      }
    }
*/
    // --- Check if user exists ---
    const existingUser = await Person.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    // --- Hash password ---
    const passwordHash = await bcrypt.hash(password, 12);

    // --- Create user ---
    const newUser = new Person({
      name,
      email,
      passwordHash,
      role: role || 'user',
      refreshToken: [] // Fixed field name
    });
    await newUser.save();

    // --- Generate tokens ---
    const payload = { userId: newUser._id, role: newUser.role };
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    // Store refresh token
    newUser.refreshToken.push(refreshToken);
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      accessToken,
      refreshToken,
      person: {
        personId: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    });

  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    if (err.code === 11000) {
      return res.status(409).json({
        status: "fail",
        message: "Duplicate field value entered",
        field: Object.keys(err.keyValue)[0],
        value: Object.values(err.keyValue)[0]
      });
    }
    next(err);
  }
};

// ---------------- LOGIN ----------------
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const existingUser = await Person.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Update admin's last login
    if (existingUser.role === 'admin') {
      existingUser.admin.lastLogin = new Date();
    }

    // Generate tokens
    const payload = { userId: existingUser._id, role: existingUser.role };
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    // Store refresh token
    existingUser.refreshToken.push(refreshToken);
    await existingUser.save();

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

  } catch (err) {
    next(err);
  }
};

// ---------------- LOGOUT ----------------
exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const user = await Person.findOne({ refreshToken: refreshToken });

    if (user) {
      user.refreshToken = user.refreshToken.filter(token => token !== refreshToken);
      await user.save();
    }

    // Always return 200, even if token not found
    res.status(200).json({ message: "Successfully logged out" });

  } catch (err) {
    next(err);
  }
};
