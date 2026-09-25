import apiClient from "./apiClient";

import {
  Alert,
} from "../types/alert";

export const getAlerts =
  async (): Promise<Alert[]> => {
    const response =
      await apiClient.get(
        "/alerts"
      );

    return response.data.data;
  };

export const markAlertAsRead =
  async (
    alertId: string
  ) => {
    const response =
      await apiClient.patch(
        `/alerts/${alertId}/read`
      );

    return response.data.data;
  };

export const markAllAlertsAsRead =
  async () => {
    await apiClient.patch(
      "/alerts/read-all"
    );
  };