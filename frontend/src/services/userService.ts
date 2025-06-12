import axios from 'axios';

export async function updateProfile(data: any) {
  // PATCH /users/me
  const res = await axios.patch('/users/me', data);
  return res.data;
}
