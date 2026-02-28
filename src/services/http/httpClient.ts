// src/services/http/httpClient.ts

import axios from "axios";
import { getToken, clearSession } from "../auth/tokenStorage";

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request: agrega token si existe
httpClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: si el backend responde 401, limpiamos sesión
httpClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      clearSession();
    }
    return Promise.reject(error);
  }
);