import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const submitKYCData = async (
  personalInfo: any,
  validID: { idType: string; idNumber: string; idImageFile: File },
  selfieBlob: Blob
) => {
  const formData = new FormData();

  // JSON data
  formData.append("personalInfo", JSON.stringify(personalInfo));
  formData.append("validIDType", validID.idType);
  formData.append("validIDNumber", validID.idNumber);

  // Files
  formData.append("validIDImage", validID.idImageFile);
  formData.append("selfieImage", selfieBlob);

  const res = await axios.post(`${API_BASE}/kyc/submit`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    withCredentials: true,
  });

  return res.data;
};
