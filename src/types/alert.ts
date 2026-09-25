export type AlertType =
  | "motion"
  | "camera_offline"
  | "device_online"
  | "device_offline"
  | "alarm"
  | "door";

export interface Alert {
  _id: string;
  deviceId?: string;
  type: AlertType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}