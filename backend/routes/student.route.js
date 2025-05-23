import { deleteRecruiter, getAllRecruiters, recregister } from "../controllers/recruiter.controller.js";
import { deleteStudent, getAllStudents, isAdmin, login, logout, sregister, updateProfile } from "../controllers/student.controller.js";
import express, { Router } from "express";
import { singleUpload } from "../middlewares/multer.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isaAdmin from "../middlewares/isAuthenticated.js";
import { Student } from "../models/student.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const router = Router();

// Auth routes
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/check-auth").get(isAuthenticated, async (req, res) => {
    try {
        const user = await Student.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error checking authentication"
        });
    }
});

// Student specific routes
router.route("/student/signup").post(singleUpload, sregister);
router.route("/student/profile/update").post(isAuthenticated, singleUpload, updateProfile);
router.route('/student/students').get(isAuthenticated, getAllStudents);
router.delete("/student/:id", isAuthenticated, isaAdmin, deleteStudent);

// Get single student profile - moved after specific routes
router.get("/student/:id", isAuthenticated, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).select("-password");
        if (!student) {
            throw new ApiError(404, "Student not found");
        }
        return res.status(200).json(
            new ApiResponse(200, student, "Student profile fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, error.message || "Error fetching student profile");
    }
});

// Recruiter routes
router.route("/recruiter/signup").post(singleUpload, recregister);
router.route("/recruiter/recruiters").get(isAuthenticated, getAllRecruiters);
router.delete("/recruiter/:id", isAuthenticated, isaAdmin, deleteRecruiter);

// Get all students - moved to the end
router.get("/students", isAuthenticated, async (req, res) => {
    try {
        const students = await Student.find()
            .select("-password")
            .select("fullname email profile role");

        return res.status(200).json(
            new ApiResponse(200, students, "Students fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, error.message || "Error fetching students");
    }
});

export default router;
