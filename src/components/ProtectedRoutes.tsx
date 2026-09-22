// src/components/ProtectedRoutes.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode; // más flexible que JSX.Element
  requiredRole?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, loading } = useAuth();

  // ⚡ Mientras se carga el usuario, no redirigimos
  if (loading) {
    return <div className="text-center mt-4">Cargando...</div>;
  }

  // Si no hay usuario autenticado, redirige a login
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Si el usuario existe pero no tiene rol definido, redirige a no autorizado
  if (!user.role) {
    return <Navigate to="/unauthorized" replace />;
  }

  const userRoleName = user.role.name;

  // Si se requiere un rol específico y el usuario no lo tiene, redirige
  if (requiredRole && !requiredRole.includes(userRoleName)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Renderiza el contenido si todo está correcto
  return <>{children}</>;
};

export default ProtectedRoute;
