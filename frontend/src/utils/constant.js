// API Endpoints
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://jobinternhub.onrender.com';

// Configure axios defaults
import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add response interceptor to handle errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
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