import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  const token = req.cookies["cu-auth-token"];

  if (!token) {
    // console.log("No token found in cookies");
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded token:", decoded);

    const user = await User.findById(decoded.userId);
    if (!user) {
      // console.log("User not found for ID:", decoded.userId);
      return res.status(401).json({ message: "User not found" });
    }

    // console.log("Authenticated user:", user);
    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    console.error("JWT error:", error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};


export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};

export function isKYCVerified(req, res, next) {
  if (req.user && req.user.isKYCVerified) {
    return next();
  }
  return res.status(403).json({ message: 'KYC verification required to perform this action.' });
}
