import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Define the types
export type Toolkit = {
  label: string;
  url: string;
  type: 'Toolkit' | 'Policy';
};

export type AdvocacyPayload = {
  title: string;
  description: string;
  goals: string[];
  toolkits: Toolkit[];
  displayImage?: string;
};

export type Advocacy = AdvocacyPayload & {
  _id: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

// Create new advocacy
export const createAdvocacy = async (data: AdvocacyPayload): Promise<Advocacy> => {
  const res = await axios.post(`${API_BASE}/advocacy`, data, {
    withCredentials: true,
  });
  return res.data;
};

// Update existing advocacy
export const updateAdvocacy = async (id: string, data: AdvocacyPayload): Promise<Advocacy> => {
  const res = await axios.put(`${API_BASE}/advocacy/${id}`, data, {
    withCredentials: true,
  });
  return res.data;
};

// Delete an advocacy
export const deleteAdvocacy = async (id: string): Promise<{ message: string }> => {
  const res = await axios.delete(`${API_BASE}/advocacy/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

// Get all advocacies
export const getAllAdvocacies = async (): Promise<Advocacy[]> => {
  const res = await axios.get(`${API_BASE}/advocacy`);
  return res.data;
};

// Get single advocacy by ID
export const getAdvocacyById = async (id: string): Promise<Advocacy> => {
  const res = await axios.get(`${API_BASE}/advocacy/${id}`);
  return res.data;
};

// Upload advocacy cover image
export const uploadAdvocacyImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axios.post(`${API_BASE}/advocacy/upload-image`, formData, {
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data.url;
};
