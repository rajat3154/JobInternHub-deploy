import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import useApi from "@/hooks/useApi";

const useGetAppliedJobs = () => {
  const { user } = useSelector((state) => state.auth);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const { get, loading, error } = useApi();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await get(`${APPLICATION_API_END_POINT}/get`);
        console.log('Applied jobs data:', data);
        setAppliedJobs(data?.appliedJobs || []);
      } catch (err) {
        console.error("Failed to fetch applied jobs", err);
      }
    };

    // Check if we have auth data
    const persistRoot = localStorage.getItem('persist:root');
    if (persistRoot) {
      fetchJobs();
    }
  }, [get]);

  return { appliedJobs, loading, error };
};

export default useGetAppliedJobs;
