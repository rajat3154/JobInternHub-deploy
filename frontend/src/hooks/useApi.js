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
      if (!persistRoot) return { token: null, user: null };

      const { auth } = JSON.parse(persistRoot);
      const authData = JSON.parse(auth);
      return {
        token: localStorage.getItem('token'),
        user: authData.user
      };
    } catch (err) {
      console.error('Error parsing auth data:', err);
      return { token: null, user: null };
    }
  };

  const apiCall = async (method, url, data = null, options = {}) => {
    try {
      setLoading(true);
      setError(null);

      const { token, user } = getAuthData();
      console.log(`Making ${method.toUpperCase()} request to ${url}`);
      console.log('Auth data:', { token: !!token, user: !!user });

      const config = {
        ...options,
        withCredentials: true,
        headers: {
          ...options.headers,
          Authorization: token ? `Bearer ${token}` : undefined
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

      console.log(`${method.toUpperCase()} response:`, response.data);
      return response.data;
    } catch (err) {
      console.error(`API Error (${method.toUpperCase()} ${url}):`, err);
      setError(err.response?.data?.message || err.message);

      if (err.response?.status === 401) {
        console.log('Authentication failed, redirecting to login');
        // Clear all auth data
        localStorage.removeItem('token');
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