import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  User,
} from "../types/auth";

import {
  login as loginService,
  register as registerService,
  logout as logoutService,
} from "../services/authService";

import {
  getToken,
  getUser,
} from "../services/storageService";

interface AuthContextValue {
  user: User | null;
  loading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => Promise<void>;
}

const AuthContext =
  createContext<
    AuthContextValue | undefined
  >(undefined);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession =
    async () => {
      try {
        const token =
          await getToken();

        const storedUser =
          await getUser<User>();

        if (
          token &&
          storedUser
        ) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error(
          "Session restore failed:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

  const login = async (
    email: string,
    password: string
  ) => {
    const loggedInUser =
      await loginService(
        email,
        password
      );

    setUser(loggedInUser);
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    const registeredUser =
      await registerService(
        name,
        email,
        password
      );

    setUser(registeredUser);
  };

  const logout = async () => {
    await logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
};