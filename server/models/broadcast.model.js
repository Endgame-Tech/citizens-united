import mongoose from 'mongoose';

const broadcastSchema = new mongoose.Schema({
  causeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cause', required: true },
  message: { type: String, required: true },
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Broadcast', broadcastSchema);
