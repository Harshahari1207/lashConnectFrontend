
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { User } from "../types/auth";

import {
  login as loginService,
  register as registerService,
  logout as logoutService,
} from "../services/authService";

import {
  getToken,
  getUser,
  saveUser,
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

  updateUser: (
    updatedUser: User
  ) => Promise<void>;
}

const AuthContext = createContext<
  AuthContextValue | undefined
>(undefined);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  // Restore the logged-in user when the app starts.
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await getToken();

        const storedUser = await getUser<User>();

        if (token && storedUser) {
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

    void restoreSession();
  }, []);

  // Login
  const login = async (
    email: string,
    password: string
  ): Promise<void> => {
    const loggedInUser = await loginService(
      email,
      password
    );

    setUser(loggedInUser);
  };

  // Register
  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    const registeredUser = await registerService(
      name,
      email,
      password
    );

    setUser(registeredUser);
  };

  // Update the user's profile information.
  const updateUser = async (
    updatedUser: User
  ): Promise<void> => {
    const normalizedUser: User = {
      ...updatedUser,

      // The profile API returns MongoDB's _id,
      // while the existing auth flow uses id.
      id:
        updatedUser.id ||
        updatedUser._id ||
        user?.id ||
        "",
    };

    // Persist the updated user across app restarts.
    await saveUser(normalizedUser);

    // Immediately refresh screens using useAuth().
    setUser(normalizedUser);

    console.log(
      "User profile updated successfully"
    );
  };

  // Logout
  const logout = async (): Promise<void> => {
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
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
};
