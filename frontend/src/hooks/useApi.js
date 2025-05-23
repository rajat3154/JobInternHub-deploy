import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const apiCall = async (method, url, data = null, options = {}) => {
    try {
      setLoading(true);
      setError(null);

      const config = {
        ...options,
        withCredentials: true, // Important for cookies
        headers: {
          ...options.headers,
          'Content-Type': 'application/json'
        }
      };

      let response;
      switch (method.toLowerCase()) {
        case 'get':
          response = await axios.get(url, config);
          break;
        case 'post':
          response = await axios.post(url, data, config);
          break;
        case 'put':
          response = await axios.put(url, data, config);
          break;
        case 'delete':
          response = await axios.delete(url, config);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      return response.data;
    } catch (err) {
      console.error(`API Error (${method.toUpperCase()} ${url}):`, err);
      setError(err.response?.data?.message || err.message);

      if (err.response?.status === 401) {
        // Clear auth data and redirect to login
        localStorage.removeItem('persist:root');
        navigate('/login');
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    get: (url, options) => apiCall('get', url, null, options),
    post: (url, data, options) => apiCall('post', url, data, options),
    put: (url, data, options) => apiCall('put', url, data, options),
    delete: (url, options) => apiCall('delete', url, null, options)
  };
};

export default useApi; 