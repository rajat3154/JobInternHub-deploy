import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Bell,
  CheckCircle,
  Zap,
  Briefcase,
  X,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Job Match!",
      message: "Senior React Developer at TechCorp matches your profile",
      timestamp: "2m ago",
      type: "job",
      read: false,
    },
    {
      id: 2,
      title: "Application Update",
      message: "Your application to DesignCo has moved to interview stage",
      timestamp: "1h ago",
      type: "application",
      read: false,
    },
    {
      id: 3,
      title: "System Alert",
      message: "Complete your profile to increase job matches by 40%",
      timestamp: "4h ago",
      type: "system",
      read: true,
    },
  ]);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated Background Layer */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 to-transparent"></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8 text-purple-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Notifications
            </h1>
          </div>
          <Button
            onClick={clearAll}
            variant="ghost"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Clear All
          </Button>
        </motion.div>

        {/* Notifications List */}
        <AnimatePresence>
          {notifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-gray-400"
            >
              No new notifications
            </motion.div>
          ) : (
            <motion.ul className="space-y-4">
              {notifications.map((notification, index) => (
                <motion.li
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className={`group relative p-6 rounded-xl backdrop-blur-lg border ${
                    notification.read
                      ? "border-gray-800 bg-gray-900/30"
                      : "border-purple-500/30 bg-purple-900/10"
                  } transition-all hover:bg-gray-800/20`}
                >
                  {/* Unread Indicator */}
                  {!notification.read && (
                    <div className="absolute top-4 right-4 h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                  )}

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {notification.type === "job" ? (
                        <Briefcase className="h-6 w-6 text-blue-400" />
                      ) : notification.type === "application" ? (
                        <Zap className="h-6 w-6 text-green-400" />
                      ) : (
                        <AlertCircle className="h-6 w-6 text-yellow-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">
                          {notification.title}
                        </h3>
                        <span className="text-sm text-gray-400">
                          {notification.timestamp}
                        </span>
                      </div>
                      <p className="text-gray-300">{notification.message}</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  {!notification.read && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        onClick={() => markAsRead(notification.id)}
                        size="sm"
                        className="bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Read
                      </Button>
                    </div>
                  )}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notifications;
