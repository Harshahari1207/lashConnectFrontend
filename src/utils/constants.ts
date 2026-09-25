export const API_URL = "http://10.0.2.2:5000/api";

export const SOCKET_URL = "http://10.0.2.2:5000";

export const APP_NAME = "Lash Connect";

export const REQUEST_TIMEOUT = 15000;

export const PTZ_ACTIONS = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
  ZOOM_IN: "zoomIn",
  ZOOM_OUT: "zoomOut",
  HOME: "home",
  STOP: "stop",
} as const;