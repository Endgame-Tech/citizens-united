import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const createChatSession = async (message: string) => {
  const res = await axios.post(`${BASE_URL}/chat-s`, { message }, { withCredentials: true });
  console.log('Created session:', res.data);
  return res.data;
};

export const getMyChatSessions = async () => {
  const res = await axios.get(`${BASE_URL}/chat-s`, { withCredentials: true });
  return res.data;
};

export const getChatMessages = async (chatId: string) => {
  const res = await axios.get(`${BASE_URL}/chat-s/${chatId}`, {
    withCredentials: true,
  });
  return res.data;
};

export const saveChatMessage = async (chatId: string, role: 'user' | 'assistant', content: string) => {
  console.log('Saving message for chatId:', chatId);
  const res = await axios.post(
    `${BASE_URL}/chat-s/${chatId}/message`,
    { role, content },
    { withCredentials: true }
  );
  return res.data;
};

export const deleteChatSession = async (chatId: string) => {
  const res = await axios.delete(`${BASE_URL}/chat-s/${chatId}`, { withCredentials: true });
  return res.data;
};
