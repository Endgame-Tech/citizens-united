import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import {
  sendInvite,
  listMyInvites,
  acceptInvite,
  declineInvite,
} from '../controllers/invite.controller.js';

const router = express.Router();

// send bulk invites
router.post('/:causeId', protect, sendInvite);

// list my pending invites
router.get('/me', protect, listMyInvites);

// accept a single invite via token
router.post('/accept/:token', protect, acceptInvite);

router.delete('/decline/:token', protect, declineInvite);

export default router;
