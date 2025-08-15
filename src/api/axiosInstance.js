// Base URL and headers here.
import axios from 'axios';
import { getAuthToken } from '../utils/authCookies';
const source = localStorage.getItem('source');
// var baseURL = 'http://192.168.0.148:8000/api/b2b/';
var baseURL = 'https://stagingbackend.stayovia.com/api/b2b/';

export const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  'Access-Control-Allow-Origin': '*', // You can add this header to request too
});

export const axiosInstanceWithToken = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  'Access-Control-Allow-Origin': '*', // You can add this header to request too
});

// Attach token dynamically before each request
axiosInstanceWithToken.interceptors.request.use((config) => {
  const token = getAuthToken();
  // sessionStorage.getItem("auth_token");
  // console.log('token', token)
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// export default axiosInstance;
