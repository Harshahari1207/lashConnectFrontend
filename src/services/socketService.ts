import { io, Socket } from "socket.io-client";

import {
  SOCKET_URL,
} from "../utils/constants";

let socket: Socket | null = null;

export const connectSocket = (
  token: string
) => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(
    SOCKET_URL,
    {
      transports: ["websocket"],
      auth: {
        token,
      },
    }
  );

  return socket;
};

export const disconnectSocket =
  () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  };

export const joinDevice =
  (
    deviceId: string
  ) => {
    socket?.emit(
      "join-device",
      deviceId
    );
  };

export const leaveDevice =
  (
    deviceId: string
  ) => {
    socket?.emit(
      "leave-device",
      deviceId
    );
  };

export const getSocket = () => socket;