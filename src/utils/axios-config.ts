// Import necessary modules and constants
import axios from "axios";
import { ROUTING } from "./constants";
import { getUserSessionData, SessionData } from "./utils";

// Create an axios instance with default configuration
export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL!, // Ensure the base URL is configured correctly
});

// Define routes that do not require authentication
const noAuthRoutes = [ROUTING.SIGNIN, ROUTING.SIGNUP];

// Add a request interceptor to the axios instance
axiosInstance.interceptors.request.use(
  (config) => {
    // Check if the request URL matches any of the no-auth routes
    const isNoAuthRoute = noAuthRoutes.some((route) =>
      config.url?.startsWith(route)
    );

    // If the route requires authentication, add the Authorization header
    if (!isNoAuthRoute) {
      const sessionData: SessionData = getUserSessionData();
      const { accessToken } = sessionData;
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }

    // Handle the Content-Type for FormData and other data
    if (config.data instanceof FormData) {
      // If it's FormData, Axios will set the correct Content-Type automatically
      delete config.headers["Content-Type"]; // Remove any manually set Content-Type
    } else {
      // If it's not FormData, ensure the Content-Type is application/json
      config.headers["Content-Type"] = "application/json";
    }

    // Return the modified config
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false; // Flag to track if the refresh token request is in progress
let failedQueue = []; // Array to store requests that fail during token refresh

// Function to handle the queue once the token is refreshed
const processQueue = (error: any, newAccessToken = null) => {
  console.log("newAccessToken", newAccessToken);
  failedQueue.forEach((prom) => {
    if (newAccessToken) {
      prom.resolve(newAccessToken); // Resolve the promise with the new token
    } else {
      prom.reject(error); // Reject the promise with the error
    }
  });
  failedQueue = []; // Clear the queue
};

axiosInstance.interceptors.response.use(
  (response) => response, // Return the response as is
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const sessionData = getUserSessionData();
      const { accessToken, refreshToken } = sessionData;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const response = await axiosInstance.post("/users/refresh-token", {
            accessToken,
            refreshToken,
          });
          const newAccessToken = response.data.accessToken;
          const newRefreshToken = response.data.refreshToken;

          if (newAccessToken) {
            localStorage.setItem("authToken", newAccessToken);
          }
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }

          axiosInstance.defaults.headers[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);

          setTimeout(() => {
            window.location.reload(); // Refresh the page
          }, 1000);

          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Error refreshing token", refreshError);
          window.location.href = "/login";
          processQueue(refreshError, null);
          throw refreshError;
        } finally {
          isRefreshing = false;
        }
      } else {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newAccessToken) => {
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;

            return axiosInstance(originalRequest);
          })
          .catch((error) => {
            throw error;
          });
      }
    } else if (error.response?.status === 404) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
