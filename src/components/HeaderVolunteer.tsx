import React, { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate, Link } from "react-router-dom";

import "bootstrap-icons/font/bootstrap-icons.css";

interface HeaderProps {
  onToggleMenu?: () => void;
}

const HeaderVolunteer: React.FC<HeaderProps> = () => {
  const { user, setUser, setIsAuthenticated } = useAuth();
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
    navigate("/volunteer/profile");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-primary d-flex align-items-center" to="/volunteer/dashboard">
          <i className="bi me-2 fs-4 text-danger d-inline-block align-middle"></i>
          Voluntariado Sivex
        </Link>
        <button
          className="navbar-toggler border-0"
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
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item me-lg-2">
              <Link className="nav-link" to="/volunteer/dashboard">
                <i className="bi bi-house-door-fill me-2 fs-5 align-middle"></i> Inicio
              </Link>
            </li>
            <li className="nav-item me-lg-2">
              <Link className="nav-link" to="/volunteer/projects">
                <i className="bi bi-folder-check me-2 fs-5 align-middle"></i> Proyectos Activos
              </Link>
            </li>
            <li className="nav-item dropdown me-lg-2">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="volunteerMenu"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-list-task me-2 fs-5 align-middle"></i> Mi Participación
              </a>
              <ul className="dropdown-menu border-0 shadow-sm" aria-labelledby="volunteerMenu">
                <li>
                  <Link className="dropdown-item" to="/volunteer/requests">
                    <i className="bi bi-envelope-open-fill me-2"></i> Mis Solicitudes
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/volunteer/my_projects">
                    <i className="bi bi-check2-square me-2"></i> Mis Proyectos
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/volunteer/issues">
                    <i className="bi bi-question-circle-fill me-2"></i> Exponer Problemática
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown d-flex align-items-center ms-lg-3">
              <span className="d-none d-lg-inline-block me-2 text-end">
                <span className="d-block fw-bold text-dark">{fullName}</span>
                <span className="d-block small text-muted">{roleName}</span>
              </span>
              <button
                className="btn btn-link dropdown-toggle text-decoration-none d-flex align-items-center p-0"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-person-circle fs-2 text-secondary"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end border-0 shadow-sm" aria-labelledby="userDropdown">
                <li>
                  <button className="dropdown-item" onClick={handleProfile}>
                    <i className="bi bi-person-fill me-2"></i> Mi Perfil
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default HeaderVolunteer;



