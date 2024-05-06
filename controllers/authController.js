
const User = require('../models/userModel');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.signup = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    // Check if either phone number or email already exists
    const existingUser = await User.findOne({
      $or: [{ phoneNumber }, { email }],
    });
    if (existingUser) {
      const conflictField = existingUser.phoneNumber === phoneNumber ? 'Phone number' : 'Email';
      return res.status(409).json({ message: `${conflictField} already exists` });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  

    // Construct the user object to be sent in the response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      token,
    };

    res.status(201).json({ ...userResponse });
  } catch (err) {
    next(err);
  }
};

exports.signin = async (req, res) => {
    try {
      const { emailOrPhone, password } = req.body;

      // Find the user by email or phone number
      const user = await User.findOne({
        $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
      });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
  
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
  