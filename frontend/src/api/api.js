import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // Important: This ensures cookies are sent with every request
});

// NOTE: The Request Interceptor has been removed. 
// Since you are using cookies, the browser attaches them automatically.
// You do not need to manually set 'Authorization': `Bearer ${token}`.

let isRefreshing = false;
let failedQueue = [];

// Updated processQueue: No longer needs to pass a token back, just resolves/rejects
const processQueue = (error) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check for 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                .then(() => {
                    // Retry the original request once refresh is done
                    return api(originalRequest);
                })
                .catch((err) => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Attempt to refresh the token
                // We don't need to grab data from 'res' because the backend 
                // should set the new Access Token in the Set-Cookie header automatically.
                await api.post('/api/token/refresh/');

                // If successful, process the queue and retry the original request
                processQueue(null);
                return api(originalRequest);
            } catch (err) {
                processQueue(err);
                
                // Optional: Handle logout or redirect to login page here
                // window.location.href = '/login'; 
                
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;