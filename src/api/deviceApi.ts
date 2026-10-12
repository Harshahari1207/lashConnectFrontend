
import apiClient from './apiClient';
import type {
  Device,
  StreamInfo,
} from '../types/device';

export interface PairDeviceOptions {
  name?: string;
}

export interface RenameDeviceOptions {
  name: string;
}

/**
 * Handles APIs that return either:
 * { data: [...] } or the result directly.
 */
function extractData<T>(responseData: unknown): T {
  if (
    responseData !== null &&
    typeof responseData === 'object' &&
    'data' in responseData
  ) {
    return (responseData as { data: T }).data;
  }

  return responseData as T;
}

/**
 * GET /api/cameras/:id/stream
 * Fetch live stream information for a device.
 */
export async function getCameraStream(
  deviceId: string,
): Promise<StreamInfo> {
  const response = await apiClient.get(
    `/cameras/${encodeURIComponent(deviceId)}/stream`,
  );

  return extractData<StreamInfo>(response.data);
}

/**
 * GET /api/devices
 * Fetch all devices available to the authenticated user.
 */
export async function getDevices(): Promise<Device[]> {
  const response = await apiClient.get('/devices');

  const data = extractData<Device[]>(response.data);

  if (!Array.isArray(data)) {
    throw new Error('Invalid devices response from server.');
  }

  return data;
}

/**
 * GET /api/devices/:id
 * Fetch one device.
 */
export async function getDevice(
  id: string,
): Promise<Device> {
  const response = await apiClient.get(
    `/devices/${encodeURIComponent(id)}`,
  );

  return extractData<Device>(response.data);
}

/**
 * POST /api/devices/pair
 * Pair a device using its device ID and pairing token.
 */
export async function pairDevice(
  deviceId: string,
  pairingToken: string,
  options: PairDeviceOptions = {},
) {
  const response = await apiClient.post('/devices/pair', {
    deviceId,
    pairingToken,
    ...options,
  });

  return extractData<unknown>(response.data);
}

/**
 * PUT /api/devices/:id
 * Rename a device.
 */
export async function renameDevice(
  id: string,
  options: RenameDeviceOptions,
) {
  const name = options.name.trim();

  if (!name) {
    throw new Error('Device name cannot be empty.');
  }

  const response = await apiClient.put(
    `/devices/${encodeURIComponent(id)}`,
    { name },
  );

  return extractData<unknown>(response.data);
}

/**
 * DELETE /api/devices/:id
 * Delete a device.
 */
export async function deleteDevice(
  id: string,
) {
  const response = await apiClient.delete(
    `/devices/${encodeURIComponent(id)}`,
  );

  return extractData<unknown>(response.data);
}