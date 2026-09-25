import apiClient from "./apiClient";

import {
  AuthResponse,
} from "../types/auth";

export const loginUser = async (
  email: string,
  password: string
) => {
  const response =
    await apiClient.post<AuthResponse>(
      "/auth/login",
      {
        email,
        password,
      }
    );

  return response.data;
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const response =
    await apiClient.post<AuthResponse>(
      "/auth/register",
      {
        name,
        email,
        password,
      }
    );

  return response.data;
};