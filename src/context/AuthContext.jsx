import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Backend URL from env
const API = import.meta.env.VITE_BACKEND_URL;

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API,
});

// Create context
export const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  // LOGIN
  const login = async (email, password) => {
    try {
      const { data } = await axiosInstance.post('/api/auth/login', {
        email,
        password,
      });

      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || 'Login failed',
      };
    }
  };

  // REGISTER
  const register = async (name, email, password, role) => {
    try {
      const { data } = await axiosInstance.post('/api/auth/register', {
        name,
        email,
        password,
        role,
      });

      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || 'Registration failed',
      };
    }
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};8