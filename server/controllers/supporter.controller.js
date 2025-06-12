import Supporter from '../models/supporter.model.js';
import Cause from '../models/cause.model.js';
import { sendSupporterInvite } from '../utils/emailHandler.js';


// Add supporter(s) manually
export const addSupporters = async (req, res) => {
  try {
    const { causeId } = req.params;
    const { supporters } = req.body;

    const cause = await Cause.findById(causeId);
    if (!cause || cause.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const newSupporters = await Supporter.insertMany(
      supporters.map(s => ({ ...s, cause: causeId }))
    );

    // Send email invitations
    for (const s of newSupporters) {
      if (s.email) {
        const link = `${process.env.CLIENT_URL}/join/${cause.joinCode}`;
        try {
          await sendSupporterInvite(s.name || 'there', s.email, cause.name, link);
        } catch (err) {
          console.error(`Failed to send invite to ${s.email}:`, err.message);
        }
      }
    }

    res.status(201).json({ message: 'Supporters invited', data: newSupporters });
  } catch (err) {
    console.error('Add Supporters Error:', err);
    res.status(500).json({ message: 'Failed to invite supporters' });
  }
};

// Get supporters for a cause
export const getSupporters = async (req, res) => {
  const { causeId } = req.params;
  const supporters = await Supporter.find({ cause: causeId });
  res.status(200).json(supporters);
};

// Update a supporter’s status/tags
export const updateSupporter = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const supporter = await Supporter.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json(supporter);
  } catch (err) {
    console.error('Update Supporter Error:', err);
    res.status(500).json({ message: 'Failed to update supporter' });
  }
};




