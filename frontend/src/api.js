import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const uploadDocument = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_BASE_URL}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onUploadProgress(percentCompleted);
    },
  });

  return response.data;
};

export const getJobStatus = async (jobId) => {
  const response = await axios.get(`${API_BASE_URL}/jobs/${jobId}`);
  return response.data;
};

export const deleteJob = async (jobId) => {
  const response = await axios.delete(`${API_BASE_URL}/jobs/${jobId}`);
  return response.data;
};
