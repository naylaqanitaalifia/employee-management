import { createContext, useContext } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  employee_id: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>; //  menyediakan function bernama login yang menerima email dan password
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
