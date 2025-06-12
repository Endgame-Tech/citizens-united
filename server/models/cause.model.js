import mongoose from 'mongoose';

const causeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },

  goals: {
    type: [String],
    default: [],
  },

  // Cause Type
  causeType: {
    type: String,
    enum: [
      'Legislative Action',
      'Executive Action',
      'Demand for Accountability',
      'Demand for Policy',
      'Governance Request',
      'Political Support for a Candidate',
      'Voting Bloc',
    ],
    required: true,
  },

  // Scope
  scope: {
    type: String,
    enum: ['National Cause', 'State Cause', 'LG Cause', 'Ward Cause'],
    required: true,
  },

  // Dynamic label: Target Candidates / Decision Makers
  targets: {
    type: [String],
    default: [],
  },

  partners: {
    type: [String],
    default: [],
  },


  // Location metadata
  location: {
    state: { type: String, required: true },
    lga: { type: String, required: true },
    ward: { type: String, required: true },
  },

  // Banner Image URL
  bannerImageUrl: { type: String, default: '' },

  // Rich Text Description (HTML string)
  richDescription: { type: String, default: '' },

  // Join Code for sharable links
  joinCode: { type: String, unique: true },

  // Approval workflow
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  rejectionReason: { type: String },

  // Creator
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  toolkits: [
    {
      label: { type: String },
      url: { type: String },
      type: { type: String, enum: ['Toolkit', 'Policy'] },
    },
  ],

  // Supporters
  supporters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {
  timestamps: true,
});

export default mongoose.model('Cause', causeSchema);
