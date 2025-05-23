import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from "../utils/constant";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Configure axios defaults
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['Content-Type'] = 'application/json';

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(`${USER_API_END_POINT}/check-auth`);
                console.log('Auth check response:', response.data);
                if (response.data.success) {
                    setUser(response.data.data);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${USER_API_END_POINT}/login`, 
                { email, password }
            );
            console.log('Login response:', response.data);
            if (response.data.success) {
                setUser(response.data.user);
                return { success: true };
            }
            return { 
                success: false, 
                error: response.data.message || 'Login failed' 
            };
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                error: error.response?.data?.message || 'Login failed' 
            };
        }
    };

    const logout = async () => {
        try {
            await axios.get(`${USER_API_END_POINT}/logout`);
            setUser(null);
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            // Even if the server request fails, clear the local user state
            setUser(null);
            return { 
                success: false, 
                error: error.response?.data?.message || 'Logout failed' 
            };
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        setUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 