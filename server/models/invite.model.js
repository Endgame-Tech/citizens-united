import mongoose from 'mongoose';

const inviteSchema = new mongoose.Schema({
  cause: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cause',
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Expired'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  acceptedAt: Date,
});

export default mongoose.model('Invite', inviteSchema);
