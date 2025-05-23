import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getAuthData = () => {
    try {
      const persistRoot = localStorage.getItem('persist:root');
      if (!persistRoot) return null;

      const { auth } = JSON.parse(persistRoot);
      const authData = JSON.parse(auth);
      return authData.user;
    } catch (err) {
      console.error('Error parsing auth data:', err);
      return null;
    }
  };

  const apiCall = async (method, url, data = null, options = {}) => {
    try {
      setLoading(true);
      setError(null);

      const user = getAuthData();
      console.log('Making request as user:', user?.email);

      // Ensure URL is using the correct base URL
      const baseUrl = 'https://jobinternhub.onrender.com';
      const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

      const config = {
        ...options,
        withCredentials: true,
        headers: {
          ...options.headers,
          'Content-Type': 'application/json'
        }
      };

      let response;
      switch (method.toLowerCase()) {
        case 'get':
          response = await axios.get(fullUrl, config);
          break;
        case 'post':
          response = await axios.post(fullUrl, data, config);
          break;
        case 'put':
          response = await axios.put(fullUrl, data, config);
          break;
        case 'delete':
          response = await axios.delete(fullUrl, config);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      // If we get a new token in response, update user data
      if (response.data?.token) {
        const currentUser = getAuthData();
        if (currentUser) {
          const updatedAuth = {
            ...JSON.parse(localStorage.getItem('persist:root')),
            auth: JSON.stringify({
              ...JSON.parse(JSON.parse(localStorage.getItem('persist:root')).auth),
              user: currentUser
            })
          };
          localStorage.setItem('persist:root', JSON.stringify(updatedAuth));
        }
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