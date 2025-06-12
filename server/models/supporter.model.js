import mongoose from 'mongoose';

const supporterSchema = new mongoose.Schema(
  {
    cause: { type: mongoose.Schema.Types.ObjectId, ref: 'Cause', required: true },
    name: String,
    email: String,
    phone: String,
    joinStatus: {
      type: String,
      enum: ['Pending', 'Joined', 'Active'],
      default: 'Pending',
    },
    decisionTag: {
      type: String,
      enum: ['Undecided', 'Not-interested', 'Committed', 'Voted'],
      default: 'Undecided',
    },
    contactStatus: {
      type: String,
      enum: ['No Response', 'Messaged recently', 'Called recently', 'Not Reachable'],
      default: 'No Response',
    },
    notes: String,
    // New fields for citizenship, voter status, and voting intent
    citizenship: {
      type: String,
      enum: ['Nigerian Citizen', 'Diasporan', 'Foreigner'],
    },
    isVoter: {
      type: String,
      enum: ['Yes', 'No'],
    },
    willVote: {
      type: String,
      enum: ['Yes', 'No'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Supporter', supporterSchema);
