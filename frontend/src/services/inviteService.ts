import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface Invite {
  _id: string;
  cause: { _id: string; name: string; description?: string; };
  email: string;
  token: string;
  status: 'Pending' | 'Accepted' | 'Expired';
  createdAt: string;
}

/** Send invitations in bulk */
export const sendInvites = async (causeId: string, supporters: { name: string; email: string }[]) => {
  const res = await axios.post(`${API_BASE}/invites/${causeId}`, { supporters }, { withCredentials: true });
  return res.data;
};

/** Get my pending invites */
export const getMyInvites = async (): Promise<Invite[]> => {
  const res = await axios.get(`${API_BASE}/invites/me`, { withCredentials: true });
  return res.data;
};

/** Accept an invite by token */
export const acceptInvite = async (token: string) => {
  const res = await axios.post(`${API_BASE}/invites/accept/${token}`, {}, { withCredentials: true });
  return res.data;
};

export const declineInvite = async (token: string): Promise<void> => {
  await axios.delete(`${API_BASE}/invites/decline/${token}`, {
    withCredentials: true,
  });
};