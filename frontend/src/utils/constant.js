// API Endpoints
const BACKEND_URL = 'https://jobinternhub.onrender.com';

// Configure axios defaults
import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor to handle authentication
axios.interceptors.request.use(
  (config) => {
    // Ensure withCredentials is set
    config.withCredentials = true;
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request details
    console.log('Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      withCredentials: config.withCredentials,
      cookies: document.cookie
    });
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
    // Log response details
    console.log('Response:', {
      status: response.status,
      headers: response.headers,
      data: response.data,
      cookies: document.cookie
    });

    // Store token in localStorage
    if (response.data?.token) {
      console.log('Storing token in localStorage');
      localStorage.setItem('token', response.data.token);
    }

    return response;
  },
  (error) => {
    // Log error details
    console.error('Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      cookies: document.cookie,
      message: error.message
    });
    
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

export const USER_API_END_POINT = `${BACKEND_URL}/api/v1`;
export const STUDENT_API_END_POINT = `${BACKEND_URL}/api/v1/student`;
export const RECRUITER_API_END_POINT = `${BACKEND_URL}/api/v1/recruiter`;
export const JOB_API_END_POINT = `${BACKEND_URL}/api/v1/job`;
export const INTERNSHIP_API_END_POINT = `${BACKEND_URL}/api/v1/internship`;
export const APPLICATION_API_END_POINT = `${BACKEND_URL}/api/v1/application`;
export const CHAT_API_END_POINT = `${BACKEND_URL}/api/v1/chat`;
export const SOCKET_URL = BACKEND_URL;