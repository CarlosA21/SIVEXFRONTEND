// src/context/AuthProvider.tsx
import React, { useEffect, useState } from "react";
import AuthContext, { AuthState } from "./AuthContext";
import { verifyToken } from "../services/authService";
import { User } from "../models/User";
import { jwtDecode } from "jwt-decode";

// 1. Nueva interfaz para el objeto Role dentro del token
interface RolePayload {
  id: number;
  name: string;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

// ⚠️ Mapea los campos del token para que coincidan con tu modelo User
interface TokenPayload {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  enrollment: string; // ✅ Asumiendo que 'enrollment' es la matrícula
  status: boolean;    // ✅ El estado del token es booleano
  role: RolePayload;
  exp?: number;
  iat?: number;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode<TokenPayload>(token);

        // ✅ Se crea el objeto User mapeando correctamente los campos del token.
        const userData: User = {
          id: decoded.id,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.email,
          // Mapea 'enrollment' a 'registrationNumber'
          registrationNumber: decoded.enrollment,
          // Mapea el estado del token (booleano) a 'active' o 'inactive' (string)
          //status: decoded.status ? "active" : "inactive",
          // Mapea el rol
          role: decoded.role,
        };

        const valid = await verifyToken(token);

        if (valid) {
          setIsAuthenticated(true);
          setUser(userData);
        } else {
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Error en la verificación del token:", error);
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const authState: AuthState = {
    isAuthenticated,
    user,
    loading,
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (

    <AuthContext.Provider
      value={{
        ...authState,
        setIsAuthenticated,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
    
  );
}