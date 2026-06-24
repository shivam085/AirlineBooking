import axios from 'axios';

// Create an Axios instance with default config
// Every API call in the app uses this instance — never import axios directly
const api = axios.create({
  baseURL: '/api/v1', // Uses Vite proxy in dev, real URL in production
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies (needed for refresh tokens later)
});

// ─── Request Interceptor ───
// Runs before every request. We'll add JWT token attachment here later.
api.interceptors.request.use(
  (config) => {
    // TODO: Attach auth token from Redux store or localStorage
    // const token = store.getState().auth.token;
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ─── Response Interceptor ───
// Runs after every response. Handles token refresh on 401 errors.
api.interceptors.response.use(
  (response) => {
    // Return the data directly — saves writing .data everywhere
    return response.data;
  },
  (error) => {
    // TODO: Handle 401 (token expired) → refresh token flow
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    
    console.error('[API Error]', message);
    return Promise.reject(error);
  }
);

export default api;
