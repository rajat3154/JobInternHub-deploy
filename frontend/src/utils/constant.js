// API Endpoints
const BACKEND_URL = 'https://jobinternhub.onrender.com';

// Configure axios defaults
import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor to log requests and ensure credentials
axios.interceptors.request.use(
  (config) => {
    // Ensure withCredentials is set
    config.withCredentials = true;
    
    // Log request details
    console.log('Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      withCredentials: config.withCredentials
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors and log responses
axios.interceptors.response.use(
  (response) => {
    // Log response details
    console.log('Response:', {
      status: response.status,
      headers: response.headers,
      data: response.data,
      cookies: document.cookie
    });
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
      // Clear any stored user data
      localStorage.removeItem('user');
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const USER_API_END_POINT = `${BACKEND_URL}/api/v1`;
export const STUDENT_API_END_POINT = `${BACKEND_URL}/api/v1/student`;
export const RECRUITER_API_END_POINT = `${BACKEND_URL}/api/v1/recruiter`;
export const JOB_API_END_POINT = `${BACKEND_URL}/api/v1/job`;
export const INTERNSHIP_API_END_POINT = `${BACKEND_URL}/api/v1/internship`;
export const APPLICATION_API_END_POINT = `${BACKEND_URL}/api/v1/application`;
export const CHAT_API_END_POINT = `${BACKEND_URL}/api/v1/chat`;
export const SOCKET_URL = BACKEND_URL;