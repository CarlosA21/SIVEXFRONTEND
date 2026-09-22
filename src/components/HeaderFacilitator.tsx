import React, { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate, Link } from "react-router-dom";

interface HeaderProps {
  onToggleMenu: () => void;
}

const HeaderFacilitator: React.FC<HeaderProps> = () => {
  const { user, setUser,  setIsAuthenticated } = useAuth();
  const [fullName, setFullName] = useState("Sin Usuario");
  const [roleName, setRoleName] = useState("sin rol");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFullName(`${user.firstName} ${user.lastName}`);
      setRoleName(user.role?.name || "sin rol");
    }
  }, [user]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  const handleProfile = () => {
    navigate("/facilitator/profile");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-primary" to="/facilitator/dashboard">
          Facilitador Sivex
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Abrir navegación"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/facilitator/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/facilitator/projects">Mis Proyectos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/facilitator/participants">Participantes & Conferencistas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/facilitator/reports">Reportes / Estadísticas</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/facilitator/problematic">Soporte</Link>
            </li>
          </ul>

          <div className="dropdown ms-lg-auto order-lg-last d-flex align-items-center">
            <span className="d-none d-lg-inline-block me-3 text-end">
              <span className="d-block fw-bold">{fullName}</span>
              <span className="d-block small text-muted">{roleName}</span>
            </span>
            <button
              className="btn btn-link dropdown-toggle text-decoration-none d-flex align-items-center p-0"
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-person-circle fs-3 text-secondary"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li>
                <button className="dropdown-item" onClick={handleProfile}>
                  <i className="bi bi-person me-2"></i> Perfil
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HeaderFacilitator;
