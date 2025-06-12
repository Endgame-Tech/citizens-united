import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import generateToken from '../utils/generateToken.js';
import { sendConfirmationEmail } from '../utils/emailHandler.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validate input
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      phone,
      passwordHash: hashedPassword,
      emailVerified: false,
    });

    // Generate auth token
    const authToken = generateToken(newUser._id);
    res.cookie('cu-auth-token', authToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    // Generate confirmation token
    const emailToken = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
    const link = `${process.env.CLIENT_URL}/auth/confirm-email/${emailToken}`;

    // Respond immediately
    res.status(201).json({ message: 'User registered successfully' });

    // Send confirmation email
    try {
      await sendConfirmationEmail(name, email, link, "confirm");
      console.log('Confirmation email sent');
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError.message);
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// LOGIN
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//     const token = generateToken(user._id);
//     res.status(200).json({ user, token });
//   } catch (error) {
//     console.error('Login Error:', error);
//     res.status(500).json({ message: 'Server error. Please try again later.' });
//   }
// };


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    // 2. Check if email is verified
    if (!user.emailVerified) {
      return res.status(403).json({ message: "Please confirm your email to log in." });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    // 4. Generate auth token
    const authToken = generateToken(user._id);

    // 5. Set cookie
    res.cookie("cu-auth-token", authToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    // Return single response
    return res.status(200).json({
      message: "Logged in successfully",
      user,
      token: authToken,
    });

  } catch (error) {
    console.error("Error in login controller:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



export const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.emailVerified = true;
    await user.save();

    res.status(200).json({ message: 'Email confirmed successfully' });
  } catch (err) {
    console.error('Email confirm error:', err);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '15m' });
    const resetLink = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;

    await sendConfirmationEmail(user.name, user.email, resetLink, "reset");

    res.status(200).json({ message: 'Reset link sent to email' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie('cu-auth-token');
  res.status(200).json({ message: 'Logged out successfully' });
};


