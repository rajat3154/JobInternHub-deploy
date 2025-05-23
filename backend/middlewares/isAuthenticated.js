import jwt from "jsonwebtoken";
import { Student } from "../models/student.model.js";
import { Recruiter } from "../models/recruiter.model.js";
import dotenv from "dotenv";

dotenv.config();

// Authentication Middleware
export const isAuthenticated = async (req, res, next) => {
      try {
            // Log request details for debugging
            console.log('Auth Request:', {
                  cookies: req.cookies,
                  headers: req.headers,
                  url: req.originalUrl
            });

            const token = req.cookies.token;
            
            if (!token) {
                  console.log('No token found in cookies');
                  return res.status(401).json({
                        success: false,
                        message: "Please login first",
                  });
            }

            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            
            if (!decoded || !decoded.userId) {
                  console.log('Invalid token structure:', decoded);
                  return res.status(401).json({
                        success: false,
                        message: "Invalid token",
                  });
            }

            // Find user based on role
            let user;
            if (decoded.role === "student") {
                  user = await Student.findById(decoded.userId);
            } else if (decoded.role === "recruiter") {
                  user = await Recruiter.findById(decoded.userId);
            }

            if (!user) {
                  console.log('User not found:', decoded.userId);
                  return res.status(401).json({
                        success: false,
                        message: "User not found",
                  });
            }

            // Attach user info to request
            req.user = {
                  id: user._id,
                  role: user.role,
                  email: user.email
            };

            // Debug log for verification
            console.log("Authenticated User:", req.user);

            // Proceed to the next middleware or route handler
            next();

      } catch (error) {
            console.error('Auth Error:', error);
            return res.status(401).json({
                  success: false,
                  message: "Authentication failed",
                  error: error.message
            });
      }
};

export default isAuthenticated;

export const isAdmin = (req, res, next) => {
      if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only admins can perform this action." });
      }
      next();
};