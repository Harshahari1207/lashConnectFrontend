import apiClient from "./apiClient";

import {
  Device,
  PairingToken,
  StreamInfo,
} from "../types/device";

export const getDevices =
  async (): Promise<Device[]> => {
    const response =
      await apiClient.get(
        "/devices"
      );

    return response.data.data;
  };

export const getDevice =
  async (
    deviceId: string
  ): Promise<Device> => {
    const response =
      await apiClient.get(
        `/devices/${deviceId}`
      );

    return response.data.data;
  };

export const createDevice =
  async (data: {
    deviceId: string;
    name: string;
    type: string;
    location?: string;
  }): Promise<Device> => {
    const response =
      await apiClient.post(
        "/devices",
        data
      );

    return response.data.data;
  };

export const updateDevice =
  async (
    deviceId: string,
    data: Partial<Device>
  ) => {
    const response =
      await apiClient.put(
        `/devices/${deviceId}`,
        data
      );

    return response.data.data;
  };

export const deleteDevice =
  async (
    deviceId: string
  ) => {
    await apiClient.delete(
      `/devices/${deviceId}`
    );
  };

export const generatePairingToken =
  async (
    deviceId: string
  ): Promise<PairingToken> => {
    const response =
      await apiClient.post(
        `/devices/${deviceId}/pairing-token`
      );

    return response.data.data;
  };

export const getCameraStream =
  async (
    deviceId: string
  ): Promise<StreamInfo> => {
    const response =
      await apiClient.get(
        `/cameras/${deviceId}/stream`
      );

    return response.data.data;
  };