
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  createChatSession,
  getMyChatSessions,
  getChatMessages,
  saveChatMessage,
  deleteChatSession,
} from '../services/chatSessionService';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type ChatSession = {
  _id: string;
  user: string;
  name: string;
  messages: ChatMessage[];
  createdAt: string;
};

interface ChatContextType {
  sessions: ChatSession[];
  activeSession: ChatSession | null;
  loading: boolean;
  createSession: (initialMessage: string) => Promise<void>;
  switchSession: (chatId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  deleteSession: (chatId: string) => Promise<void>;
}

const ChatSessionContext = createContext<ChatContextType | undefined>(undefined);

export const ChatSessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getMyChatSessions();
        console.log('Loaded sessions:', data);
        setSessions(data);
        if (data.length > 0) {
          setActiveSession(data[0]); // Set first session as active
        }
      } catch (err) {
        console.error('Error loading sessions:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const createSession = async (initialMessage: string) => {
    if (!initialMessage.trim()) return;
    console.log('Creating session with message:', initialMessage);
    try {
      const newSession = await createChatSession(initialMessage);
      console.log('New session:', newSession);
      setSessions((prev) => [newSession, ...prev]);
      setActiveSession(newSession);
    } catch (err) {
      console.error('Error creating session:', err);
      throw err;
    }
  };

  const switchSession = async (chatId: string) => {
    try {
      const session = await getChatMessages(chatId);
      console.log('Switched to session:', session);
      setActiveSession(session);
    } catch (err) {
      console.error('Error switching session:', err);
      throw err;
    }
  };

  const sendMessage = async (content: string) => {
    if (!activeSession) {
      console.error('No active session');
      return;
    }
    console.log('Sending message for session:', activeSession._id);
    try {
      await saveChatMessage(activeSession._id, 'user', content);
      const updated = await getChatMessages(activeSession._id);
      setActiveSession(updated);
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  };

  const deleteSession = async (chatId: string) => {
    try {
      await deleteChatSession(chatId);
      const filtered = sessions.filter((s) => s._id !== chatId);
      setSessions(filtered);
      setActiveSession(filtered.length > 0 ? filtered[0] : null);
    } catch (err) {
      console.error('Error deleting session:', err);
      throw err;
    }
  };

  return (
    <ChatSessionContext.Provider
      value={{ sessions, activeSession, loading, createSession, switchSession, sendMessage, deleteSession }}
    >
      {children}
    </ChatSessionContext.Provider>
  );
};

export const useChatSession = () => {
  const ctx = useContext(ChatSessionContext);
  if (!ctx) throw new Error('useChatSession must be used within ChatSessionProvider');
  return ctx;
};
