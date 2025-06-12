// services/stateOfNationImageService.ts
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface StatImage {
  _id: string;
  imageUrl: string;
  title?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  order?: number;
}

export const fetchStatImages = async (): Promise<StatImage[]> => {
  const res = await axios.get(`${API_BASE}/state-of-nation-images`, {
    withCredentials: true,
  });
  return res.data;
};

export const uploadStatImage = async (file: File): Promise<StatImage> => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await axios.post(
    `${API_BASE}/state-of-nation-images`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }
  );

  if (!res.data || !res.data.imageUrl) {
    throw new Error("Failed to upload image");
  }

  return res.data;
};

export const deleteStatImage = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE}/state-of-nation-images/${id}`, {
    withCredentials: true,
  });
};

export const updateStatImage = async (id: string, file: File): Promise<StatImage> => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await axios.put(
    `${API_BASE}/state-of-nation-images/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }
  );

  if (!res.data || !res.data.imageUrl) {
    throw new Error("Failed to update image");
  }

  return res.data;
};

export const updateImagesOrder = async (imageIds: string[]): Promise<StatImage[]> => {
  const res = await axios.put(
    `${API_BASE}/state-of-nation-images/order`,
    { imageIds },
    { withCredentials: true }
  );
  return res.data;
};
