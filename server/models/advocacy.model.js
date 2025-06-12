import mongoose from 'mongoose';

const advocacySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    goals: {
      type: [String],
      default: []
    },
    status: { type: String, enum: ['Active', 'Draft'], default: 'Active' },
    displayImage: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    toolkits: [
      {
        label: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String, enum: ['Toolkit', 'Policy'], required: true },
      },
    ],
  },
  { timestamps: true }
);

export const Advocacy = mongoose.model('Advocacy', advocacySchema);