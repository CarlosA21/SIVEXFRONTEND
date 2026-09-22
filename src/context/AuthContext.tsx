// src/context/AuthContext.ts
import { createContext } from "react";
import { User } from "../models/User";

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

interface AuthContextProps extends AuthState {
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  loading: false,
  setIsAuthenticated: () => {},
  setUser: () => {},
});

export default AuthContext;
