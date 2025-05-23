import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { sregister, login, logout, updateProfile, getAllStudents, deleteStudent, getProfile } from "../controllers/student.controller.js";

const router = express.Router();

// Auth routes
router.post("/register", sregister);
router.post("/login", login);
router.get("/logout", logout);

// Profile routes
router.get("/:type/:id", isAuthenticated, getProfile);
router.put("/update", isAuthenticated, updateProfile);

// Admin routes
router.get("/all", isAuthenticated, getAllStudents);
router.delete("/:id", isAuthenticated, deleteStudent);

export default router; 