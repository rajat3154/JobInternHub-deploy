import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import jobRoute from "./routes/job.route.js"
import internshipRoute from "./routes/internship.route.js"
import studentRoute from "./routes/student.route.js";
import applicationRoute from "./routes/application.route.js"
import adminRoute from "./routes/admin.route.js"
import messageRoute from "./routes/message.route.js"
import followRoute from "./routes/follow.routes.js"
import { app, io, server } from "./socket/socket.js";

dotenv.config({});

// Debug environment variables
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
const corsOptions = {
      origin: ['https://jobinternhub.vercel.app', 'http://localhost:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
      exposedHeaders: ['Content-Range', 'X-Content-Range'],
      maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Add a test route to verify CORS
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

// Add a test route to verify authentication
app.get('/api/v1/test-auth', (req, res) => {
      console.log('Cookies:', req.cookies);
      console.log('Headers:', req.headers);
      res.json({ 
            message: 'Auth test route',
            cookies: req.cookies,
            headers: req.headers
      });
});

const PORT = process.env.PORT || 8000;

// Routes
app.use("/api/v1", studentRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/internship", internshipRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/messages", messageRoute);
app.use("/api/v1/follow", followRoute);

// Error handling middleware
app.use((err, req, res, next) => {
      console.error('Error:', err);
      if (err.message === 'Not allowed by CORS') {
            return res.status(403).json({
                  success: false,
                  message: 'CORS error: Origin not allowed',
                  origin: req.headers.origin,
                  allowedOrigins: corsOptions.origin
            });
      }
      res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
});

server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      connectDB();
});
