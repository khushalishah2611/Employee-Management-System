import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_EMPLOYEE_API;
const fallbackBaseURL = 'http://localhost:5000';

if (!rawBaseURL) {
  console.warn(`VITE_EMPLOYEE_API is not set. Falling back to ${fallbackBaseURL}`);
}

const resolvedBaseURL = (rawBaseURL || fallbackBaseURL).replace(/\/$/, '');

export const apiService = axios.create({
  baseURL: resolvedBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});
