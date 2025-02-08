import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // sesuaikan dengan port backend Anda
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;