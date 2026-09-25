export interface Recording {
  _id: string;
  deviceId: string;
  startTime: string;
  endTime: string;
  duration?: number;
  storageUrl?: string;
  thumbnailUrl?: string;
}