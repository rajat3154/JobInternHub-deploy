// API Endpoints
const BACKEND_URL = 'https://jobinternhub.onrender.com';

// Configure axios defaults
import axios from 'axios';
axios.defaults.baseURL = BACKEND_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor to handle authentication
axios.interceptors.request.use(
  (config) => {
    console.log('=== Request Start ===');
    console.log('URL:', config.url);
    console.log('Method:', config.method);
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token ? 'Present' : 'Missing');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Ensure withCredentials is set
    config.withCredentials = true;
    
    console.log('Request Headers:', config.headers);
    console.log('With Credentials:', config.withCredentials);
    console.log('=== Request End ===');
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors and authentication
axios.interceptors.response.use(
  (response) => {
    console.log('=== Response Start ===');
    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    console.log('Data:', response.data);
    
    // Store token in localStorage if present in response
    if (response.data?.token) {
      console.log('Storing token in localStorage');
      localStorage.setItem('token', response.data.token);
    }
    
    console.log('=== Response End ===');
    return response;
  },
  (error) => {
    console.error('=== Response Error ===');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Headers:', error.response?.headers);
    console.error('Message:', error.message);
    
    if (error.response?.status === 401) {
      console.log('Clearing stored data due to 401');
      // Clear stored data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Function to check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  console.log('Auth check - Token present:', !!token);
  return !!token;
};

// Function to get auth token
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const USER_API_END_POINT = '/api/v1';
export const STUDENT_API_END_POINT = '/api/v1/student';
export const RECRUITER_API_END_POINT = '/api/v1/recruiter';
export const JOB_API_END_POINT = '/api/v1/job';
export const INTERNSHIP_API_END_POINT = '/api/v1/internship';
export const APPLICATION_API_END_POINT = '/api/v1/application';
export const CHAT_API_END_POINT = '/api/v1/chat';
export const SOCKET_URL = BACKEND_URL;