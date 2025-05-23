import { Student } from "../models/student.model.js";
import { Recruiter } from "../models/recruiter.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const followUser = async (req, res) => {
    try {
        const { followerId, followingId, followerType, followingType } = req.body;

        // Validate input
        if (!followerId || !followingId || !followerType || !followingType) {
            throw new ApiError(400, "All fields are required");
        }

        // Get follower and following models based on types
        const FollowerModel = followerType === 'Student' ? Student : Recruiter;
        const FollowingModel = followingType === 'Student' ? Student : Recruiter;

        // Update follower's following list
        await FollowerModel.findByIdAndUpdate(
            followerId,
            {
                $addToSet: {
                    following: followingId,
                    followingType: followingType
                }
            }
        );

        // Update following user's followers list
        await FollowingModel.findByIdAndUpdate(
            followingId,
            {
                $addToSet: {
                    followers: followerId,
                    followersType: followerType
                }
            }
        );

        return res.status(200).json(
            new ApiResponse(200, {}, "Successfully followed user")
        );
    } catch (error) {
        throw new ApiError(500, error.message || "Error following user");
    }
};

export const unfollowUser = async (req, res) => {
    try {
        const { followerId, followingId, followerType, followingType } = req.body;

        // Validate input
        if (!followerId || !followingId || !followerType || !followingType) {
            throw new ApiError(400, "All fields are required");
        }

        // Get follower and following models based on types
        const FollowerModel = followerType === 'Student' ? Student : Recruiter;
        const FollowingModel = followingType === 'Student' ? Student : Recruiter;

        // Update follower's following list
        await FollowerModel.findByIdAndUpdate(
            followerId,
            {
                $pull: {
                    following: followingId,
                    followingType: followingType
                }
            }
        );

        // Update following user's followers list
        await FollowingModel.findByIdAndUpdate(
            followingId,
            {
                $pull: {
                    followers: followerId,
                    followersType: followerType
                }
            }
        );

        return res.status(200).json(
            new ApiResponse(200, {}, "Successfully unfollowed user")
        );
    } catch (error) {
        throw new ApiError(500, error.message || "Error unfollowing user");
    }
};

export const getFollowers = async (req, res) => {
    try {
        const { userId, userType } = req.params;

        // Convert userType to proper case for model selection
        const Model = userType.toLowerCase() === 'student' ? Student : Recruiter;
        const user = await Model.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Fetch followers from both Student and Recruiter models
        const followerStudents = await Student.find({
            _id: { $in: user.followers || [] }
        }).select('fullname companyname profile.profilePhoto role');

        const followerRecruiters = await Recruiter.find({
            _id: { $in: user.followers || [] }
        }).select('fullname companyname profile.profilePhoto role');

        // Combine and format the results
        const followers = [
            ...followerStudents.map(student => ({
                ...student.toObject(),
                role: 'Student'
            })),
            ...followerRecruiters.map(recruiter => ({
                ...recruiter.toObject(),
                role: 'Recruiter'
            }))
        ];

        return res.status(200).json(
            new ApiResponse(200, followers, "Followers fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, error.message || "Error fetching followers");
    }
};

export const getFollowing = async (req, res) => {
    try {
        const { userId, userType } = req.params;

        // Convert userType to proper case for model selection
        const Model = userType.toLowerCase() === 'student' ? Student : Recruiter;
        const user = await Model.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Fetch following users from both Student and Recruiter models
        const followingStudents = await Student.find({
            _id: { $in: user.following || [] }
        }).select('fullname companyname profile.profilePhoto role');

        const followingRecruiters = await Recruiter.find({
            _id: { $in: user.following || [] }
        }).select('fullname companyname profile.profilePhoto role');

        // Combine and format the results
        const following = [
            ...followingStudents.map(student => ({
                ...student.toObject(),
                role: 'Student'
            })),
            ...followingRecruiters.map(recruiter => ({
                ...recruiter.toObject(),
                role: 'Recruiter'
            }))
        ];

        return res.status(200).json(
            new ApiResponse(200, following, "Following users fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, error.message || "Error fetching following users");
    }
}; 