import axios from "axios";
import {
  authState,
  onRefreshed,
  subscribeTokenRefresh,
} from "../modules/auth/context/AuthState";

export const api = axios.create({
  baseURL: `http://localhost:3000/api`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    const is401 = error.response.status === 401;

    const currentPath = window.location.pathname;
    const isOnLoginPage = currentPath === "/login";

    const isOnPublicPage = currentPath === "/" || currentPath === "/register";

    const REFRESH_ENDPOINT = "/auth/refresh";
    const isRefreshCall =
      typeof originalRequest.url === "string" &&
      originalRequest.url.includes(REFRESH_ENDPOINT);

    const isAuthEndpoint =
      originalRequest.url?.includes("/api/auth/login") ||
      originalRequest.url?.includes("/api/auth/register") ||
      isRefreshCall;

    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (is401 && !originalRequest._retry) {
      if (authState.isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      authState.isRefreshing = true;

      try {
        await api.get(REFRESH_ENDPOINT);
        authState.isRefreshing = false;
        onRefreshed();
        return api(originalRequest);
      } catch {
        authState.isRefreshing = false;
        if (!authState.isRedirecting && !isOnLoginPage && !isOnPublicPage) {
          authState.isRedirecting = true;
          window.location.replace("/login");
        }
      }
    }

    return Promise.reject(error);
  }
);
