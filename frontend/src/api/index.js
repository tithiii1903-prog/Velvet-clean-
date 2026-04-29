import axios from 'axios';

const api = axios.create({
  baseURL: 'https://velvet-clean.onrender.com',
});

export default api;
