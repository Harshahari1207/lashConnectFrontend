
import apiClient from "./apiClient";
import type { Recording } from "../types/recording";
import { API_URL } from "../utils/constants";
import { getToken } from "../services/storageService";

export async function startRecording(
  deviceId: string
): Promise<Recording> {
  const response = await apiClient.post(
    "/recordings/start",
    { deviceId }
  );

  return response.data.data;
}

export async function stopRecording(
  recordingId: string
): Promise<Recording> {
  const response = await apiClient.post(
    `/recordings/${recordingId}/stop`
  );

  return response.data.data;
}

export async function getRecordings(
  deviceId?: string
): Promise<Recording[]> {
  const response = await apiClient.get(
    "/recordings",
    {
      params: deviceId ? { deviceId } : undefined,
    }
  );

  return response.data.data;
}

export async function getRecording(
  recordingId: string
): Promise<Recording> {
  const response = await apiClient.get(
    `/recordings/${recordingId}`
  );

  return response.data.data;
}

export async function getRecordingVideoSource(
  recordingId: string
) {
  const token = await getToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  return {
    uri: `${API_URL}/recordings/${recordingId}/video`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}
