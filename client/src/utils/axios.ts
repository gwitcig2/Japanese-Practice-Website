import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {

        if (error.response?.status === 401) {

            try {
                await axios.put("/api/sessions", { withCredentials: true });
                return api(error.config);
            } catch (refreshError) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);

    }
);

export default api;
