export type DeviceType =
  | "camera"
  | "sensor"
  | "door"
  | "alarm";

export type DeviceStatus =
  | "online"
  | "offline"
  | "unknown";

export interface Device {
  _id?: string;
  deviceId: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  ownerId?: string;
  paired: boolean;
  streamPath?: string;
  location?: string;
  lastSeenAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PairingToken {
  deviceId: string;
  token: string;
  expiresAt: string;
}

export interface StreamInfo {
  deviceId: string;
  streamPath?: string;
  streamUrl?: string;
}