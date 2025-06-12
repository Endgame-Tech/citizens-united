import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const getOwnedCauses = async () => {
  const res = await axios.get(`${API_BASE}/causes/owned`, {
    withCredentials: true,
  });
  return res.data;
};

export const getJoinedCauses = async () => {
  const res = await axios.get(`${API_BASE}/causes/joined`, {
    withCredentials: true,
  });
  return res.data;
};

export const createCause = async (data: {
  name: string;
  description: string;
  richDescription: string;
  goals: string[];
  targets: string[];
  partners: string[];
  causeType: string;
  scope: string;
  location: {
    state: string;
    lga: string;
    ward: string;
  };
  bannerImageUrl: string;
  toolkits?: { label: string; url: string; type: string }[];
}) => {
  const res = await axios.post(`${API_BASE}/causes`, data, {
    withCredentials: true,
  });
  return res.data;
};

export const getCauseById = async (id: string) => {
  const res = await axios.get(`${API_BASE}/causes/${id}`, { withCredentials: true });
  return res.data;
};

export const updateCause = async (id: string, data: any) => {
  const res = await axios.patch(`${API_BASE}/causes/${id}`, data, {
    withCredentials: true,
  });
  return res.data;
};

export const deleteCause = async (id: string) => {
  const res = await axios.delete(`${API_BASE}/causes/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

export const getCauseByCode = async (code: string) => {
  const res = await axios.get(`${API_BASE}/causes/code/${code}`);
  return res.data;
};

export const joinCause = async (
  code: string,
  form: { firstName: string; lastName: string; email: string; personalInfo?: any }
): Promise<any> => {
  const res = await axios.post(`${API_BASE}/causes/join/${code}`, form,
    { withCredentials: true });
  return res.data;
};


export const uploadRichDescriptionImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_BASE}/causes/upload-rich-description-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });

  if (!response.data || !response.data.url) {
    throw new Error('Failed to upload image');
  }

  return response.data.url;
};

export const uploadCauseBannerImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_BASE}/causes/upload-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });

  if (!response.data || !response.data.url) {
    throw new Error('Failed to upload banner image');
  }

  return response.data.url;
};

export const getAllCauses = async () => {
  const res = await axios.get(`${API_BASE}/causes`, {
    withCredentials: true,
  });
  return res.data;
};
