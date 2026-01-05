import axios from "axios";

const BASE_URL = "http://localhost:9090/api/v1"
// AWS URL
// const BASE_URL="http://shopnowdbdeployment-env.eba-urmrin7p.ap-south-1.elasticbeanstalk.com/api/v1"

export const api = axios.create({
    baseURL: BASE_URL
});

export const privateApi = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// Add access token to every request
privateApi.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("authToken");
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => Promise.reject(error));


export const refreshApi = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// 🟢 FIX 1: Update the refresher function to send the token in the BODY
const refreshToken = async () => {
    try {
        // Get the stored refresh token
        const currentRefreshToken = localStorage.getItem("refreshToken");

        // Send it in the body: { refreshToken: "..." }
        const response = await refreshApi.post("/auth/refresh-token", 
            { refreshToken: currentRefreshToken }
        );
        
        return response.data; // Returns { accessToken, refreshToken }
    } catch (error) {
        throw error;
    }
};

privateApi.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/auth/refresh-token")
        ) {
            originalRequest._retry = true;

            try {
                // 🟢 FIX 2: Call the updated refresher
                const data = await refreshToken();
                
                const newAccessToken = data.accessToken;
                
                // Update Local Storage
                localStorage.setItem("authToken", newAccessToken);
                // (Optional) Update refresh token if your backend rotates it
                // localStorage.setItem("refreshToken", data.refreshToken);

                // Retry original request
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return privateApi(originalRequest);

            } catch (refreshError) {
                // Logout if refresh fails
                localStorage.removeItem("authToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);