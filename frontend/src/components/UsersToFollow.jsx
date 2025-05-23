import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { MessageSquare, Users, AlertCircle, Sparkles } from 'lucide-react';
import FollowButton from './FollowButton';
import { useAuth } from '../context/AuthContext';
import { Skeleton } from './ui/skeleton';
import { motion } from 'framer-motion';

const UsersToFollow = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch all users
                const [studentsRes, recruitersRes] = await Promise.all([
                    axios.get("http://localhost:8000/api/v1/student/students", {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true
                    }),
                    axios.get("http://localhost:8000/api/v1/recruiter/recruiters", {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true
                    })
                ]);

                // Fetch current user's following list
                const followingRes = await axios.get(
                    `http://localhost:8000/api/v1/follow/following/${user._id}/${user.role}`,
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true
                    }
                );

                const followingIds = followingRes.data.data.map(user => user._id);

                // Combine and filter users
                const allUsers = [
                    ...(studentsRes.data.data || []).map(student => ({
                        ...student,
                        userType: "student",  // Force student type for users from student endpoint
                        role: "Student"
                    })),
                    ...(recruitersRes.data.data || []).map(recruiter => ({
                        ...recruiter,
                        userType: "recruiter",  // Force recruiter type for users from recruiter endpoint
                        role: "Recruiter"
                    }))
                ].filter(u => 
                    u._id !== user?._id && // Not the current user
                    !followingIds.includes(u._id) // Not in following list
                );

                // Log the users for debugging
                console.log('Mapped users:', allUsers.map(u => ({
                    name: u.fullname,
                    type: u.userType,
                    role: u.role
                })));

                // Randomize users
                setUsers(allUsers.sort(() => 0.5 - Math.random()));
            } catch (error) {
                console.error('Error fetching users:', error);
                setError(error.response?.data?.message || error.message || "Failed to load users");
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && user) {
            fetchUsers();
        } else if (!authLoading && !user) {
            setLoading(false);
        }
    }, [user, authLoading]);

    const handleProfileClick = (userId, userType) => {
        // Ensure we're using the correct type for navigation
        const profileType = userType.toLowerCase();
        navigate(`/profile/${profileType}/${userId}`);
    };

    const renderSkeleton = () => (
        <div className="space-y-4 p-2">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center space-x-3 p-3">
                    <Skeleton className="h-10 w-10 rounded-full bg-gray-800" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[120px] bg-gray-800" />
                        <Skeleton className="h-3 w-[80px] bg-gray-800" />
                    </div>
                    <Skeleton className="h-8 w-20 rounded-md bg-gray-800" />
                </div>
            ))}
        </div>
    );

    if (authLoading || loading) {
        return renderSkeleton();
    }

    if (!user) {
        return (
            <div className="text-center p-6">
                <div className="inline-flex items-center justify-center p-3 mb-3 rounded-full bg-blue-500/10 mx-auto">
                    <Sparkles className="h-5 w-5 text-blue-400" />
                </div>
                <p className="text-gray-400 mb-4 text-sm">Sign in to discover people to connect with</p>
                <Button
                    variant="outline"
                    onClick={() => navigate('/login')}
                    className="text-blue-400 border-blue-400/50 hover:bg-blue-400/10"
                    size="sm"
                >
                    Sign In
                </Button>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-6">
                <div className="inline-flex items-center justify-center p-3 mb-3 rounded-full bg-red-500/10 mx-auto">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <p className="text-red-400 font-medium text-sm mb-2">{error}</p>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-400"
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </Button>
            </div>
        );
    }

    if (!users.length) {
        return (
            <div className="text-center p-6">
                <div className="inline-flex items-center justify-center p-3 mb-3 rounded-full bg-gray-800 mx-auto">
                    <Users className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-gray-400 text-sm">No recommendations available</p>
            </div>
        );
    }

    return (
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
            <div className="space-y-3 p-2">
                {users.map((user) => (
                    <motion.div
                        key={user._id}
                        whileHover={{ scale: 1.01 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50 hover:bg-gray-800/50 transition-colors cursor-pointer"
                        onClick={() => handleProfileClick(user._id, user.userType)}
                    >
                        <Avatar className="h-10 w-10 border border-blue-500/20">
                            <AvatarImage src={user.profile?.profilePhoto} />
                            <AvatarFallback className="bg-gray-800 text-blue-400">
                                {(user.fullname || user.companyname)?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-white truncate">
                                {user.fullname || user.companyname}
                            </h3>
                            <p className="text-xs text-gray-400 truncate">
                                {user.userType === "student"
                                    ? user.profile?.headline || "Student"
                                    : user.role || "Recruiter"}
                            </p>
                        </div>
                        <div className="flex gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/messages?userId=${user._id}`);
                                }}
                            >
                                <MessageSquare className="h-4 w-4" />
                            </Button>
                            <FollowButton
                                userId={user._id}
                                userType={user.userType}
                                size="sm"
                                className="h-8 px-2"
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default UsersToFollow;