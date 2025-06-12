import ChatSession from '../models/chatSession.model.js';

export const createChatSession = async (req, res) => {
  const { message } = req.body;
  const userId = req.userId;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: 'Message is required.' });
  }

  // Limit to 5 sessions per user
  const existingSessions = await ChatSession.find({ userId });
  if (existingSessions.length >= 5) {
    return res.status(400).json({ message: 'Maximum 5 chat sessions allowed.' });
  }

  const name = message.split(' ').slice(0, 4).join(' ') + (message.length > 30 ? '...' : '');

  const newSession = await ChatSession.create({
    userId,
    name,
    messages: [{ role: 'user', content: message }],
  });

  res.status(201).json(newSession);
};

export const getChatSessions = async (req, res) => {
  const sessions = await ChatSession.find({ userId: req.userId }).sort({ updatedAt: -1 });
  res.status(200).json(sessions);
};

export const getChatMessages = async (req, res) => {
  const session = await ChatSession.findOne({ _id: req.params.id, userId: req.userId });
  if (!session) return res.status(404).json({ message: 'Session not found' });
  res.status(200).json(session); // Return full session
};

export const addMessageToSession = async (req, res) => {
  const { role, content } = req.body;
  if (!role || !content) return res.status(400).json({ message: 'Invalid message' });

  const session = await ChatSession.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { $push: { messages: { role, content } } },
    { new: true }
  );

  if (!session) return res.status(404).json({ message: 'Session not found' });
  res.status(200).json(session);
};

export const deleteChatSession = async (req, res) => {
  await ChatSession.deleteOne({ _id: req.params.id, userId: req.userId });
  res.status(200).json({ message: 'Session deleted' });
};