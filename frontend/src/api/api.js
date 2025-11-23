// import axios from 'axios';

// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_URL,
//     withCredentials: true, // important: sends cookies automatically
// });

// // Add access token to headers if available
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('access_token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//     failedQueue.forEach(prom => {
//         if (error) prom.reject(error);
//         else prom.resolve(token);
//     });
//     failedQueue = [];
// };

// api.interceptors.response.use(
//     response => response,
//     async (error) => {
//         const originalRequest = error.config;

//         if (error.response?.status === 401 && !originalRequest._retry) {
//             if (isRefreshing) {
//                 // Queue requests while refreshing
//                 return new Promise((resolve, reject) => {
//                     failedQueue.push({ resolve, reject });
//                 }).then(token => {
//                     originalRequest.headers.Authorization = `Bearer ${token}`;
//                     return api(originalRequest);
//                 }).catch(err => Promise.reject(err));
//             }

//             originalRequest._retry = true;
//             isRefreshing = true;

//             try {
//                 // **Use cookies** for refresh token
//                 const res = await api.post('/api/token/refresh/', null, { withCredentials: true });
//                 const newAccessToken = res.data.access;
//                 localStorage.setItem('access_token', newAccessToken);

//                 originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//                 processQueue(null, newAccessToken);
//                 return api(originalRequest);
//             } catch (err) {
//                 processQueue(err, null);
//                 // Clear tokens if refresh fails
//                 localStorage.removeItem('access_token');
//                 console.error('Token refresh failed:', err);
//                 return Promise.reject(err);
//             } finally {
//                 isRefreshing = false;
//             }
//         }

//         return Promise.reject(error);
//     }
// );

// export default api;

import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, 
});

let isRefreshing = false;
let failedQueue = [];

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

        // CRITICAL FIX: Prevent infinite loops
        // If the URL that failed is /api/token/refresh/, DO NOT try to refresh again.
        if (originalRequest.url.includes('/token/refresh/')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                .then(() => {
                    return api(originalRequest);
                })
                .catch((err) => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Attempt to refresh
                await api.post('/api/token/refresh/');
                
                // If success, retry queue
                processQueue(null);
                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                // If refresh fails, we generally want to let the app handle the redirect
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;