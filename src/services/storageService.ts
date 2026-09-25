import AsyncStorage from
  "@react-native-async-storage/async-storage";

const TOKEN_KEY = "accessToken";
const USER_KEY = "user";

export const saveToken = async (
  token: string
) => {
  await AsyncStorage.setItem(
    TOKEN_KEY,
    token
  );
};

export const getToken = async () => {
  return AsyncStorage.getItem(TOKEN_KEY);
};

export const removeToken = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

export const saveUser = async (
  user: unknown
) => {
  await AsyncStorage.setItem(
    USER_KEY,
    JSON.stringify(user)
  );
};

export const getUser = async <T>() => {
  const value =
    await AsyncStorage.getItem(USER_KEY);

  if (!value) {
    return null;
  }

  return JSON.parse(value) as T;
};

export const removeUser = async () => {
  await AsyncStorage.removeItem(USER_KEY);
};

export const clearStorage = async () => {
  await AsyncStorage.multiRemove([
    TOKEN_KEY,
    USER_KEY,
  ]);
};