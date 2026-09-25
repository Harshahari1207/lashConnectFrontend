import axios from "axios";

import {
  API_URL,
  REQUEST_TIMEOUT,
} from "../utils/constants";

import {
  getToken,
  removeToken,
} from "../services/storageService";

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async config => {
    const token =
      await getToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

apiClient.interceptors.response.use(
  response => response,

  async error => {
    if (
      error.response?.status === 401
    ) {
      await removeToken();
    }

    return Promise.reject(error);
  }
);

export default apiClient;