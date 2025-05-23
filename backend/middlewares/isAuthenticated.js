import jwt from "jsonwebtoken";
import { Student } from "../models/student.model.js";
import { Recruiter } from "../models/recruiter.model.js";
import dotenv from "dotenv";

dotenv.config();

// Authentication Middleware
export const isAuthenticated = async (req, res, next) => {
      try {
            console.log('🔒 Auth Check - Headers:', req.headers);
            console.log('🔒 Auth Check - Cookies:', req.cookies);
            console.log('🔒 Auth Check - Origin:', req.headers.origin);

            // Get token from cookie or Authorization header
            const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
            
            if (!token) {
                  console.log('❌ No token found');
                  return res.status(401).json({
                        success: false,
                        message: "Not authorized to access this route",
                  });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            console.log('✅ Token decoded:', decoded);
            
            if (!decoded || !decoded.userId) {
                  console.log('Invalid token structure:', decoded);
                  return res.status(401).json({
                        success: false,
                        message: "Invalid token",
                  });
            }

            // Get user based on role
            let user;
            if (decoded.role === "student") {
                  user = await Student.findById(decoded.userId);
            } else if (decoded.role === "recruiter") {
                  user = await Recruiter.findById(decoded.userId);
            }

            if (!user) {
                  console.log('❌ User not found');
                  return res.status(401).json({
                        success: false,
                        message: "User not found",
                  });
            }

            // Attach user to request
            req.user = user;
            req.id = user._id;
            console.log('✅ User authenticated:', user.email);

            next();
      } catch (error) {
            console.error('❌ Auth Error:', error);
            return res.status(401).json({
                  success: false,
                  message: "Not authorized to access this route",
            });
      }
};

export default isAuthenticated;

export const isAdmin = (req, res, next) => {
      if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ 
                  success: false,
                  message: "Only admins can perform this action." 
            });
      }
      next();
};