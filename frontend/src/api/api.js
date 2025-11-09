import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;

api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && !isRefreshing) {
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const res = await api.post('/api/token/refresh/', { refresh: refreshToken });
                localStorage.setItem('access_token', res.data.access);
                isRefreshing = false;
                return api(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                console.error('Token refresh failed:', refreshError);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
