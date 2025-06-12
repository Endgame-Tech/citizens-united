import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getNotifications = async () => {
  const res = await axios.get(`${BASE_URL}/notifications`, {
    withCredentials: true,
  });

  if (!Array.isArray(res.data)) {
    console.warn("Expected an array but got:", res.data);
    return [];
  }

  return res.data;
};

export const markAllNotificationsAsRead = async () => {
  try {
    const res = await axios.patch(
      `${BASE_URL}/notifications/mark-all-read`,
      {},
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to mark notifications as read:", error);
    throw error;
  }
};
