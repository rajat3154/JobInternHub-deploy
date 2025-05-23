import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllJobs } from "@/redux/jobSlice";
import PostJob from "./recruiter/PostJob";

const Jobs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);
  const [showPostJob, setShowPostJob] = useState(false);

  const fetchJobs = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/job/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch jobs");
      }

      if (data.success && Array.isArray(data.jobs)) {
        dispatch(setAllJobs(data.jobs));
      } else {
        console.error("Invalid job data format");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [dispatch]);

  useEffect(() => {
    if (searchedQuery) {
      const filteredJobs = allJobs.filter((job) => {
        return (
          job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchedQuery.toLowerCase())
        );
      });
      setFilterJobs(filteredJobs);
    } else {
      setFilterJobs(allJobs || []);
    }
  }, [allJobs, searchedQuery]);

  const handleJobPosted = () => {
    fetchJobs();
    setShowPostJob(false);
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto text-center py-10">
        <h1 className="text-4xl font-bold mb-3 text-blue-500">
          Browse <span className="text-white text-4xl">Job </span> Listings
        </h1>
        <p className="text-lg text-gray-300">
          Find your dream job in just a few clicks!
        </p>

        {user?.role === "recruiter" && (
          <Button
            onClick={() => setShowPostJob(true)}
            className="mt-4 bg-green-500 hover:bg-green-600"
          >
            Post New Job
          </Button>
        )}
      </div>

      {showPostJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <PostJob
            onClose={() => setShowPostJob(false)}
            onSuccess={handleJobPosted}
          />
        </div>
      )}

      <div className="container mx-auto flex gap-6 px-4 flex-1">
        <div className="w-1/5 bg-black p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-lg font-semibold text-blue-400 mb-4">
            Filter Jobs
          </h2>
          <FilterCard />
        </div>

        <div className="flex-1 overflow-y-auto pb-5">
          {filterJobs.length <= 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 text-xl font-medium">
                No jobs found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterJobs.map((job) => (
                <div
                  key={job._id}
                  className="relative p-6 rounded-lg shadow-lg bg-black text-white border border-blue-500 hover:bg-gray-800 cursor-pointer transition duration-300"
                >
                  {/* Apply Now only for students */}
                  {user?.role === "student" && (
                    <button
                      onClick={() => navigate(`/job/description/${job._id}`)}
                      className="absolute top-3 right-4 text-white bg-green-500 border-green-500 hover:bg-green-600 transition duration-300 ease-in-out px-4 py-2 rounded-md cursor-pointer"
                    >
                      Apply Now
                    </button>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-400">
                      {new Date(job.createdAt).toDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    <img
                      src={
                        job.company?.logo || "https://via.placeholder.com/50"
                      }
                      alt="Company Logo"
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h1 className="font-semibold text-lg">
                        {job.company?.name || "Samsung"}
                      </h1>
                      <p className="text-sm text-gray-400">{job.location}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h1 className="font-bold text-xl mb-3">{job.title}</h1>
                    <p className="text-sm text-gray-300">{job.description}</p>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2 py-1 bg-blue-400 text-black text-sm font-bold rounded-md">
                      {job.position} Positions
                    </span>
                    <span className="px-2 py-1 bg-red-600 text-white text-sm font-bold rounded-md">
                      {job.jobType}
                    </span>
                    <span className="px-2 py-1 bg-yellow-400 text-black text-sm font-bold rounded-md">
                      {job.salary} LPA
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-7">
                    <Button
                      onClick={() => {
                        if (user?.role === "student") {
                          navigate(`/job/description/${job._id}`);
                        } else if (user?.role === "recruiter") {
                          navigate(`/job/details/${job._id}`);
                        }
                      }}
                      variant="outline"
                      className="px-2 py-1 bg-blue-500 border-blue-500 text-white text-sm font-bold rounded-md hover:bg-blue-600 cursor-pointer"
                    >
                      Details
                    </Button>
                    <Button className="px-2 py-1 bg-[#7209b7] text-white text-sm font-bold rounded-md hover:bg-purple-900 cursor-pointer">
                      Save for later
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Jobs;
