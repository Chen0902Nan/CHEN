import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { useUserStore } from "@/store/useUserStore";
import type { RefreshTokenResponse } from "@/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:3000/api";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface PendingRequest {
  config: RetryableRequestConfig;
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}

const instance = axios.create({
  baseURL: API_BASE_URL,
});

let isRefreshing = false;
let requestsQueue: PendingRequest[] = [];

const flushQueue = (token: string) => {
  requestsQueue.forEach(({ config, resolve, reject }) => {
    config.headers.Authorization = `Bearer ${token}`;
    instance(config).then(resolve).catch(reject);
  });
  requestsQueue = [];
};

const rejectQueue = (error: unknown) => {
  requestsQueue.forEach(({ reject }) => reject(error));
  requestsQueue = [];
};

instance.interceptors.request.use((config) => {
  const token = useUserStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (res) => res.data,
  async (error: AxiosError) => {
    const config = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;

    if (!config || status !== 401 || config._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        requestsQueue.push({ config, resolve, reject });
      });
    }

    config._retry = true;
    isRefreshing = true;

    try {
      const { refreshToken } = useUserStore.getState();
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }

      const tokens = await instance.post<
        RefreshTokenResponse,
        RefreshTokenResponse
      >("/auth/refresh", {
        refresh_token: refreshToken,
      });

      useUserStore.setState({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        isLogin: true,
      });

      flushQueue(tokens.access_token);
      config.headers.Authorization = `Bearer ${tokens.access_token}`;
      return instance(config);
    } catch (refreshError) {
      rejectQueue(refreshError);
      useUserStore.getState().logout();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default instance;
