import axios from "axios";
import Cookies from "js-cookie";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: "/api",
});

// Add a request interceptor to dynamically attach the token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken"); // Retrieve token from cookies
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
