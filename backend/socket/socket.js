import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
      'https://jobinternhub.vercel.app',
      'http://localhost:5173',
      process.env.FRONTEND_URL
].filter(Boolean);

const io = new Server(server, {
      cors: {
            origin: function(origin, callback) {
                  if (!origin || allowedOrigins.includes(origin)) {
                        callback(null, true);
                  } else {
                        callback(new Error('Not allowed by CORS'));
                  }
            },
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            credentials: true,
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
      }
});

const userSocketMap = {}; // { userId: socketId }
const onlineUsers = new Set(); // Track online users

// Get receiver's socketId for private messaging
export const getReceiverSocketId = (receiverId) => {
      return userSocketMap[receiverId];
};

// Socket connection logic
io.on("connection", (socket) => {
      const userId = socket.handshake.query.userId;

      if (userId) {
            userSocketMap[userId] = socket.id;
            onlineUsers.add(userId);
            console.log(`User connected: ${userId} => ${socket.id}`);

            // Notify all clients of user coming online
            io.emit("user:status", { userId, isOnline: true });
      }

      // Handle user online status
      socket.on("user:online", (userId) => {
            onlineUsers.add(userId);
            io.emit("user:status", { userId, isOnline: true });
      });

      // Handle user offline status
      socket.on("user:offline", (userId) => {
            onlineUsers.delete(userId);
            io.emit("user:status", { userId, isOnline: false });
      });

      // Handle get online status request
      socket.on("get:onlineStatus", (userIds) => {
            userIds.forEach(userId => {
                  socket.emit("user:status", { 
                        userId, 
                        isOnline: onlineUsers.has(userId) 
                  });
            });
      });

      // Handle new messages
      socket.on("message:new", (message) => {
            const receiverId = message.receiverId;
            const receiverSocketId = getReceiverSocketId(receiverId);

            if (receiverSocketId) {
                  io.to(receiverSocketId).emit("message:new", message);
            }
      });

      socket.on("disconnect", () => {
            if (userId) {
                  delete userSocketMap[userId];
                  onlineUsers.delete(userId);
                  console.log(`User disconnected: ${userId}`);
                  io.emit("user:status", { userId, isOnline: false });
            }
      });
});

export { app, io, server };
