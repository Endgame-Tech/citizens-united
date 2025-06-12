import { nanoid } from 'nanoid';
import Invite from '../models/invite.model.js';
import Cause from '../models/cause.model.js';
import User from '../models/user.model.js';
import Supporter from '../models/supporter.model.js';
import { sendSupporterInvite } from '../utils/emailHandler.js'; // your mailtrap helper

/**
 * Send one or many invites for a cause
 * POST /invites/:causeId
 * body: { supporters: [{ name, email, phone? }, ...] }
 */
export const sendInvite = async (req, res) => {
  try {
    const { causeId } = req.params;
    const { supporters } = req.body; // array of {name,email,phone}
    const cause = await Cause.findById(causeId);
    if (!cause) return res.status(404).json({ message: 'Cause not found' });

    const inviteDocs = [];
    for (const s of supporters) {
      const token = nanoid(10);
      const invite = await Invite.create({
        cause: cause._id,
        email: s.email,
        token,
        invitedBy: req.userId,
      });
      inviteDocs.push(invite);

      // Optionally seed a Supporter entry in Pending state
      await Supporter.create({
        cause: cause._id,
        name: s.name,
        email: s.email,
        phone: s.phone || '',
        joinStatus: 'Pending',
        decisionTag: 'Undecided',
        contactStatus: 'No Response',
        notes: '',
      });

      // send email
      const joinLink = `${process.env.CLIENT_URL}/invite/${token}`;
      await sendSupporterInvite(s.name, s.email, cause.name, joinLink);
    }

    res.status(201).json({ invites: inviteDocs });
  } catch (err) {
    console.error('sendInvite Error:', err);
    res.status(500).json({ message: 'Failed to send invites' });
  }
};

/**
 * List pending invites for the logged-in user
 * GET /invites/me
 */
export const listMyInvites = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const invites = await Invite.find({
      email: user.email,
      status: 'Pending',
    }).populate('cause', 'name');
    res.json(invites);
  } catch (err) {
    console.error('listMyInvites Error:', err);
    res.status(500).json({ message: 'Failed to list invites' });
  }
};

/**
 * Accept an invitation, add you to the cause, and mark the invite accepted
 * POST /invites/accept/:token
 */
export const acceptInvite = async (req, res) => {
  try {
    const { token } = req.params;
    const invite = await Invite.findOne({ token });
    if (!invite || invite.status !== 'Pending') {
      return res.status(404).json({ message: 'Invalid or expired invite' });
    }

    const user = await User.findById(req.userId).select('name email phone joinedCauses');
    if (user.email !== invite.email) {
      return res.status(403).json({ message: 'Not authorized to accept this invite' });
    }

    // mark invite accepted
    invite.status = 'Accepted';
    invite.acceptedAt = new Date();
    await invite.save();

    // add to cause.supporters if not there
    const cause = await Cause.findById(invite.cause);
    if (!cause.supporters.includes(user._id)) {
      cause.supporters.push(user._id);
      await cause.save();
    }

    // update user's joinedCauses
    if (!user.joinedCauses.includes(cause._id)) {
      user.joinedCauses.push(cause._id);
      await user.save();
    }

    // make a real Supporter record now Active
    await Supporter.findOneAndUpdate(
      { cause: cause._id, email: user.email },
      {
        user: user._id,
        joinStatus: 'Joined',
        decisionTag: 'Undecided',
        contactStatus: 'No Response',
      },
      { new: true }
    );

    res.json({ message: 'Invite accepted', causeId: cause._id });
  } catch (err) {
    console.error('acceptInvite Error:', err);
    res.status(500).json({ message: 'Failed to accept invite' });
  }
};

export const declineInvite = async (req, res) => {
  try {
    const { token } = req.params;
    // find the invite
    const invite = await Invite.findOne({ token, status: 'Pending' });
    if (!invite) {
      return res.status(404).json({ message: 'Invite not found or already handled' });
    }

    // remove the pending supporter record for that email & cause
    await Supporter.deleteOne({
      cause: invite.cause,
      email: invite.email,
      joinStatus: 'Pending',
    });

    // delete the invite
    await invite.deleteOne();

    return res.status(204).end();
  } catch (err) {
    console.error('declineInvite Error:', err);
    res.status(500).json({ message: 'Failed to decline invite' });
  }
};

