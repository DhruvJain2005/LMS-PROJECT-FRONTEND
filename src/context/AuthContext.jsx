import { createContext, useState, useEffect } from "react";
import axios from "axios";

// ✅ Backend URL (safe fallback)
const API =
  import.meta.env.VITE_BACKEND_URL ||
  "https://lms-backend-3j0x.onrender.com";

// ✅ Axios instance
const axiosInstance = axios.create({
  baseURL: API,
});

// ✅ Create Context
export const AuthContext = createContext();

// ✅ Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user from localStorage
  useEffect(() => {
    try {
      const userInfo = localStorage.getItem("userInfo");

      if (userInfo) {
        const parsedUser = JSON.parse(userInfo);
        setUser(parsedUser);

        // ✅ Attach token globally (if exists)
        if (parsedUser?.token) {
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${parsedUser.token}`;
        }
      }
    } catch (err) {
      console.error("LocalStorage error:", err);
      localStorage.removeItem("userInfo");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ LOGIN
  const login = async (email, password) => {
    try {
      const { data } = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });

      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));

      // ✅ Set token globally
      if (data?.token) {
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.token}`;
      }

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Login failed",
      };
    }
  };

  // ✅ REGISTER
  const register = async (name, email, password, role) => {
    try {
      const { data } = await axiosInstance.post("/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));

      // ✅ Set token globally
      if (data?.token) {
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.token}`;
      }

      return { success: true };
    } catch (error) {
      console.error("Register error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registration failed",
      };
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");

    // ✅ Remove token
    delete axiosInstance.defaults.headers.common["Authorization"];
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
};