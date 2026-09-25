import {
  loginUser,
  registerUser,
} from "../api/authApi";

import {
  saveToken,
  saveUser,
  clearStorage,
} from "./storageService";

export const login = async (
  email: string,
  password: string
) => {
  const response =
    await loginUser(
      email,
      password
    );

  await saveToken(
    response.data.token
  );

  await saveUser(
    response.data.user
  );

  return response.data.user;
};

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  const response =
    await registerUser(
      name,
      email,
      password
    );

  await saveToken(
    response.data.token
  );

  await saveUser(
    response.data.user
  );

  return response.data.user;
};

export const logout = async () => {
  await clearStorage();
};