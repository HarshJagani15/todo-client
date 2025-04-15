import axios from "axios";
import { LOCALSTORAGE, ROUTES, ROUTING } from "./constants";
import { getUserSessionData, SessionData } from "./utils";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL!,
});

const noAuthRoutes = [ROUTING.SIGNIN, ROUTING.SIGNUP];

axiosInstance.interceptors.request.use(
  (config) => {
    const isNoAuthRoute = noAuthRoutes.some((route) =>
      config.url?.startsWith(route)
    );

    if (!isNoAuthRoute) {
      const sessionData: SessionData = getUserSessionData();
      const { accessToken } = sessionData;
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error: unknown, newAccessToken = null) => {
  failedQueue.forEach((prom) => {
    if (newAccessToken) {
      prom.resolve(newAccessToken);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
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
            localStorage.setItem(LOCALSTORAGE.AUTHTOKEN, newAccessToken);
          }
          if (newRefreshToken) {
            localStorage.setItem(LOCALSTORAGE.REFRESHTOKEN, newRefreshToken);
          }

          axiosInstance.defaults.headers[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);

          setTimeout(() => {
            window.location.reload();
          }, 1000);

          return axiosInstance(originalRequest);
        } catch (refreshError) {
          window.location.href = ROUTES.LOGIN;
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
    }

    return Promise.reject(error);
  }
);
