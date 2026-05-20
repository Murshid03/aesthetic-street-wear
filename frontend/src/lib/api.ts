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

export const getErrorMessage = (err: any, fallback = "An error occurred"): string => {
    if (!err) return fallback;

    // Try err.response.data.error (could be string or object)
    const errorData = err.response?.data?.error;
    if (typeof errorData === "string" && errorData) return errorData;
    if (errorData && typeof errorData === "object") {
        if (typeof errorData.message === "string" && errorData.message) return errorData.message;
        // MongoDB-style: { code, message } — stringify safely
        return String(errorData.message || errorData.code || fallback);
    }

    // Try err.response.data.message
    const dataMessage = err.response?.data?.message;
    if (typeof dataMessage === "string" && dataMessage) return dataMessage;
    if (dataMessage && typeof dataMessage === "object") {
        return String((dataMessage as any).message || fallback);
    }

    // Axios network-level message
    if (typeof err.message === "string" && err.message) return err.message;

    return fallback;
};

