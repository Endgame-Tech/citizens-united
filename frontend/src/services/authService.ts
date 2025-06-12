import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const registerUser = async (data: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) => {
  const response = await axios.post(`${API_BASE}/auth/register`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${API_BASE}/auth/login`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const res = await axios.get(`${API_BASE}/auth/me`, {
    withCredentials: true,
  });
  return res.data.user;
};

export const logoutUser = async () => {
  const response = await axios.post(`${API_BASE}/auth/logout`, {}, {
    withCredentials: true,
  });
  return response.data;
};

