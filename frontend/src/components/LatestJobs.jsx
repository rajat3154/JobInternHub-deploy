import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LatestJobCards from "./LatestJobCards";
import { JOB_API_END_POINT } from "../utils/constant";

const LatestJobs = ({ query }) => {
  const [latestJobs, setLatestJobs] = useState([]);
  const [error, setError] = useState(null);

  const fetchLatestJobs = async () => {
    try {
      const response = await axios.get(`${JOB_API_END_POINT}/latest`, {
        withCredentials: true
      });

      if (response.data.success && Array.isArray(response.data.jobs)) {
        setLatestJobs(response.data.jobs);
        setError(null);
      } else {
        console.error("Invalid job data format", response.data);
        setError("Failed to load jobs. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching latest jobs:", error);
      setError("Failed to load jobs. Please try again later.");
      setLatestJobs([]);
    }
  };

  useEffect(() => {
    fetchLatestJobs();
  }, []);

  const filteredJobs = latestJobs.filter((job) => {
    const q = query?.toLowerCase().trim();
    if (!q) return true;

    const combinedValues = [
      job.title,
      job.description,
      job.company?.name,
      job.location,
      job.type,
      job.stipend,
      job.duration,
      ...(job.skills || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return combinedValues.includes(q);
  });

  return (
    <div className="bg-black text-white py-16">
      <div className="container mx-auto text-center px-4">
        <h1 className="text-5xl font-bold mb-10">
          <span className="text-blue-500 text-3xl">Latest and Top </span>Job
          Openings
        </h1>

        {error && (
          <div className="text-red-500 mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length <= 0 ? (
            <span className="col-span-full text-gray-400 text-lg">
              {error ? "Error loading jobs" : "No Jobs Available"}
            </span>
          ) : (
            filteredJobs.map((job) => (
              <LatestJobCards key={job._id} job={job} />
            ))
          )}

          <Link
            to="/jobs"
            className="p-6 rounded-lg shadow-lg bg-black text-white border border-blue-500 hover:bg-gray-800 cursor-pointer transition duration-300 flex flex-col items-center justify-center"
          >
            <h2 className="text-2xl font-bold text-blue-400">View More Jobs</h2>
            <p className="mt-2 text-gray-300 text-lg">
              Explore all job openings
            </p>
            <div className="mt-6 flex justify-center">
              <button className="w-12 h-12 flex items-center justify-center rounded-full border border-blue-500 text-blue-400 text-2xl cursor-pointer hover:text-white transition duration-300">
                ➡️
              </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LatestJobs;
