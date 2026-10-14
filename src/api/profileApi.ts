
import apiClient from "./apiClient";
import type { User } from "../types/auth";

type ProfileResponse = {
  success: boolean;
  message?: string;
  data: User;
};

export type ProfileUpdate = {
  name: string;
  phone: string;
  city: string;
};

export async function getMyProfile(): Promise<User> {
  const response = await apiClient.get<ProfileResponse>(
    "/profile/me",
  );

  return response.data.data;
}

export async function updateMyProfile(
  changes: ProfileUpdate,
): Promise<User> {
  const response = await apiClient.patch<ProfileResponse>(
    "/profile/me",
    changes,
  );

  return response.data.data;
}
