import axios from 'axios';
const URL = process.env.REACT_APP_BACKEND_URL;
const api = axios.create({
  // baseURL: 'http://localhost:3001',
  baseURL: URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔥 response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error?.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
