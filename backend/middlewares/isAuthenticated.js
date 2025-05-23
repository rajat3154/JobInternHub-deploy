import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Authentication Middleware
const isAuthenticated = async (req, res, next) => {
      try {
            // Debug request headers and cookies
            console.log('Request headers:', req.headers);
            console.log('Request cookies:', req.cookies);

            // Retrieve token from cookies
            const token = req.cookies.token;
            
            // Check if token exists
            if (!token) {
                  console.log('No token found in cookies');
                  return res.status(401).json({
                        message: "User not authenticated, token missing",
                        success: false,
                  });
            }

            // Verify the token
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            console.log('Decoded token:', decoded);

            // Ensure the decoded token has the required userId
            if (!decoded || !decoded.userId) {
                  console.log('Invalid token or missing userId');
                  return res.status(401).json({
                        message: "Invalid token or missing userId",
                        success: false,
                  });
            }

            // Attach the user info to the request
            req.user = {
                  id: decoded.userId,
                  role: decoded.role,
            };

            // Debug log for verification
            console.log("Authenticated User:", req.user);

            // Proceed to the next middleware or route handler
            next();

      } catch (error) {
            console.error("Authentication Error:", error.message);
            return res.status(401).json({
                  message: "Authentication failed",
                  success: false,
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