import apiClient from "./apiClient";

import {
  Recording,
} from "../types/recording";

export const getRecordings =
  async (
    deviceId?: string
  ): Promise<Recording[]> => {
    const response =
      await apiClient.get(
        "/recordings",
        {
          params: deviceId
            ? { deviceId }
            : undefined,
        }
      );

    return response.data.data;
  };

export const getRecording =
  async (
    recordingId: string
  ): Promise<Recording> => {
    const response =
      await apiClient.get(
        `/recordings/${recordingId}`
      );

    return response.data.data;
  };