import { Student } from "../models/student.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Recruiter } from "../models/recruiter.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import RecruiterRequest from "../models/recruiterrequest.model.js";
export const recregister = async (req, res) => {
      try {
            const { companyname, email, cinnumber, password, companyaddress, role } = req.body;
            if (!companyname || !email || !cinnumber || !password || !companyaddress) {
                  return res.status(400).json({
                        message: "All fields are required",
                        success: false
                  });
            }
            if (!req.file) {
                  return res.status(400).json({
                        message: "Profile photo is required",
                        success: false
                  });
            }
            const file = req.file;
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            if (role !== "recruiter") {
                  return res.status(400).json({
                        message: "Invalid role",
                        success: false
                  });
            }
            // Check for existing recruiters
            const existingRequest = await RecruiterRequest.findOne({ email });
            const recruiterExists = await Recruiter.findOne({ email });
            if (recruiterExists) {
                  return res.status(400).json({
                        message: "Email already exists",
                        success: false
                  });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await RecruiterRequest.create({
                  companyname,
                  email,
                  cinnumber,
                  password: hashedPassword,
                  companyaddress,
                  role: "recruiter",
                  profile: {
                        profilePhoto: cloudResponse.secure_url,
                  }
            });
            return res.status(201).json({
                  message: "Registration submitted for approval",
                  success: true,
            });

      } catch (error) {
            console.error("Error in register", error);
            return res.status(500).json({
                  message: "Internal server error",
                  success: false,
                  error: error.message,
            });
      }
};
export const getAllRecruiters = async (req, res) => {
      try {
            const recruiters = await Recruiter.find({}, {
                  password: 0, // Exclude password from response
                  __v: 0,     // Exclude version field
            });

            return res.status(200).json({
                  message: "Recruiters fetched successfully",
                  success: true,
                  data: recruiters
            });
      } catch (error) {
            console.error("Error fetching recruiters:", error);
            return res.status(500).json({
                  message: "Error fetching recruiters",
                  success: false,
                  error: error.message
            });
      }
};

export const deleteRecruiter = async (req, res) => {
      try {
            const recruiterId = req.params.id;

            // Optional: Only admin can delete, check if user is admin
            if (req.user.role !== "admin") {
                  return res.status(403).json({ message: "Access denied. Admins only." });
            }

            const deletedRecruiter = await Recruiter.findByIdAndDelete(recruiterId);

            if (!deletedRecruiter) {
                  return res.status(404).json({ message: "Recruiter not found." });
            }

            res.status(200).json({ message: "Recruiter deleted successfully." });
      } catch (error) {
            console.error("Error deleting recruiter:", error);
            res.status(500).json({ message: "Server error while deleting recruiter." });
      }
};


