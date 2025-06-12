import express from 'express';
import {
  createChatSession,
  getChatSessions,
  getChatMessages,
  addMessageToSession,
  deleteChatSession,
} from '../controllers/chatSession.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createChatSession);
router.get('/', protect, getChatSessions);
router.get('/:id', protect, getChatMessages);
router.post('/:id/message', protect, addMessageToSession); // Changed from PUT to POST
router.delete('/:id', protect, deleteChatSession);

export default router;