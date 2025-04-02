
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_API_BASE_URL } from '@env'; 

const api = axios.create({
  baseURL: REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log("Base URL API", REACT_APP_API_BASE_URL)

// Interceptor to attach token automatically
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');  // ✅ Get stored token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;  // ✅ Attach token
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export default api;

