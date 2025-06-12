import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const getSupporters = async (causeId: string) => {
  const res = await axios.get(`${API_BASE}/supporters/${causeId}`, {
    withCredentials: true,
  });
  return res.data;
};

export const addSupporters = async (causeId: string, supporters: any[]) => {
  const res = await axios.post(`${API_BASE}/supporters/${causeId}`, { supporters }, {
    withCredentials: true,
  });
  return res.data;
};

export const updateSupporter = async (id: string, updates: any) => {
  const res = await axios.patch(`${API_BASE}/supporters/update/${id}`, updates, {
    withCredentials: true,
  });
  return res.data;
};
