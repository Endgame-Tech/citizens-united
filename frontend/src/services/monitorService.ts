// services/monitorService.ts
import axios from 'axios';

export const submitOfficerArrivalData = async (data: any, token: string) => {
  const url = `${import.meta.env.VITE_BACKEND_URL}/monitor/officer-arrival`;

  const response = await axios.post(url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export const submitResultTrackingData = async (data: any, token: string) => {
  const url = `${import.meta.env.VITE_BACKEND_URL}/monitor/result-tracking`;

  const response = await axios.post(url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export const submitIncidentReportData = async (data: any, token: string) => {
  const url = `${import.meta.env.VITE_BACKEND_URL}/monitor/incident-report`;

  const response = await axios.post(url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

