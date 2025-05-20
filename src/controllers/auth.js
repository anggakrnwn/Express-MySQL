const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/users");

const register = async (req, res) => {
  const { name, email, password, address, role_id } = req.body;

  try {
    const isFirstUser = (await UserModel.getAllUsers()).length === 0;

    if (!isFirstUser && role_id && role_id !== 1) {
      return res.status(403).json({
        message: "Only first user can become admin",
      });
    }

    const user = await UserModel.getUserByEmail(email);
    if (user) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await UserModel.createNewUser({
      name,
      email,
      address,
      password: hashedPassword,
      role_id: isFirstUser ? 2 : role_id || 1,
    });

    res.status(201).json({
      message: "Registration successful",
      data: {
        id: userId,
        name,
        email,
        role_id: isFirstUser ? 2 : role_id || 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const registerAdmin = async (req, res) => {
  const { admin_secret, ...userData } = req.body;
  
  if (admin_secret !== process.env.ADMIN_REGISTER_SECRET) {
    return res.status(403).json({ message: 'Invalid admin secret' });
  }

  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userId = await UserModel.createNewUser({
      ...userData,
      password: hashedPassword,
      role_id: 2 
    });
    
    res.status(201).json({
      message: 'Admin registration successful',
      data: {
        id: userId,
        name: userData.name,
        email: userData.email,
        role_id: 2
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.idusers,
        role: user.role_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.idusers,
        name: user.name,
        email: user.email,
        role: user.role_id,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = { register, login, registerAdmin };
