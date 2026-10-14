
export type UserRole =
  | "admin"
  | "operator"
  | "viewer";

export interface User {
  id: string;
  _id?: string;

  name: string;
  email: string;
  role: UserRole;

  phone?: string;
  city?: string;

  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;

  data: {
    user: User;
    token: string;
  };
}
