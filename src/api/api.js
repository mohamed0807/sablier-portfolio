import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

export const createStream = (data) =>
  axios.post(`${API_BASE_URL}/streams`, data);
export const getStreams = (sender) =>
  axios.get(`${API_BASE_URL}/streams?sender=${sender}`);

export const getStreamById = (streamId) =>
  axios.get(`${API_BASE_URL}/streams/${streamId}`);

export const cancelStream = (streamId) =>
  axios.delete(`${API_BASE_URL}/streams/${streamId}`);

export const withdrawStream = (data) =>
  axios.post(`${API_BASE_URL}/streams/withdraw`, data);

export const depositStream = (data) =>
  axios.post(`${API_BASE_URL}/streams/deposit`, data);
