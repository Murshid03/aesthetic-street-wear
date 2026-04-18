import axios from "axios";

const api = axios.create({
    baseURL: "/api",
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
    const stored = localStorage.getItem("asw_user");
    if (stored) {
        const { token } = JSON.parse(stored);
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export { api };
export default api;
