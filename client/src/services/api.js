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
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Prevent infinite loops by marking the request as retried
      originalRequest._retry = true;

      try {
        // Make request to refresh token (browser will automatically send HttpOnly cookie)
        // We use raw axios here to avoid triggering this interceptor again
        const response = await axios.post('/api/v1/auth/refresh', {}, {
          withCredentials: true
        });

        const newAccessToken = response.data.data.accessToken;
        
        // Save new access token
        localStorage.setItem('accessToken', newAccessToken);

        // Update the authorization header and retry the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails (e.g. refresh token expired), clear local storage and force login
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    
    console.error('[API Error]', message);
    return Promise.reject(error);
  }
);

export default api;
