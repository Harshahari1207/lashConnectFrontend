
export interface Recording {
  _id: string;
  deviceId: string;
  ownerId: string;

  startTime: string;
  endTime?: string;

  durationSeconds?: number;
  sizeBytes?: number;

  storageType: "local" | "cloud";

  status: "recording" | "completed" | "failed";

  fileUrl?: string;
  thumbnailUrl?: string;

  createdAt?: string;
  updatedAt?: string;
}
