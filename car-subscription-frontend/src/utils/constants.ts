// axiosInstance
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_BE_URL, // base URL for your API
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for sending and receiving cookies
});

export default axiosInstance;