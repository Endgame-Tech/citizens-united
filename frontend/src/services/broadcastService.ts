import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface BroadcastPayload {
  causeId: string;
  message: string;
}

export const sendBroadcastMessage = async ({ causeId, message }: BroadcastPayload) => {
  const res = await axios.post(
    `${BASE_URL}/broadcasts/send`,
    { causeId, message },
    { withCredentials: true } // ensure cookies are sent
  );
  return res.data;
};


export const getBroadcastsByCause = async (causeId: string) => {
  const res = await axios.get(`${BASE_URL}/broadcasts/by-cause/${causeId}`);
  return res.data;
};
