import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface SidebarProps {
  collapsed: boolean;
  isMobileOpen: boolean;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const { isAuthenticated, setIsAuthenticated, setUser, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Nuevo estado para controlar el submenú
  const [isFormMenuOpen, setIsFormMenuOpen] = useState(false);

  const handleLogout = () => {
    if (isAuthenticated) {
      setIsAuthenticated(false);
      setUser(null);
      navigate("/auth/login");
    }
    localStorage.removeItem("token");
  };

  const isAdmin = (): boolean =>
    typeof user?.role?.name === "string" &&
    user.role.name.toUpperCase() === "ADMINISTRATOR";

  const isCoordinator = (): boolean =>
    typeof user?.role?.name === "string" &&
    user.role.name.toUpperCase() === "COORDINATOR"; // corregido


  // const isVolunteer = (): boolean =>
  //   typeof user?.role?.name === "string" &&
  //   user.role.name.toUpperCase() === "VOLUNTEER";

  // const isFacilitator = (): boolean =>
  //   typeof user?.role?.name === "string" &&
  //   user.role.name.toUpperCase() === "FACILITATOR"; // corregido

  // const isSchoolDirector = (): boolean =>
  //   typeof user?.role?.name === "string" &&
  //   user.role.name.toUpperCase() === "SCHOOL_DIRECTOR"; // corregido




  const isActive = (path: string): string =>
    location.pathname === path ? "active-link" : "";

  const isSubmenuActive = [
    "/form/users",
    "/form/Enclosures",
    "/form/projects",
    "/form/activities",
    "/form/type-projects",
    "/form/project-manager"
  ].some(path => location.pathname.startsWith(path));

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Abrir el submenú si ya estás en una ruta del mismo
  React.useEffect(() => {
    if (isSubmenuActive) {
      setIsFormMenuOpen(true);
    }
  }, [location.pathname]);

  return (
    <>
      {isMobileOpen && (
        <div className="sidebar-overlay" onClick={toggleMobileMenu}></div>
      )}

      <button
        className="btn btn-toggle-sidebar d-md-none m-2 "
        onClick={toggleMobileMenu}
        aria-label="Toggle sidebar menu"
        style={{textAlign:'right'}}
      >
        <i className="bi bi-list fs-3"></i>
      </button>

      <div
        id="sidebar-wrapper"
        className={`sidebar ${collapsed ? "collapsed" : ""} ${isMobileOpen ? "show-mobile" : ""
          }`}
      >
        <div className="sidebar-heading text-center py-4 d-flex align-items-center justify-content-center">
          <i
            className={`bi ${collapsed ? "bi-layers fs-3" : "bi-layers-half fs-3"
              }`}
          />
          {!collapsed && (
            <span className="ms-3 fw-bold fs-5">
              {import.meta.env.VITE_NOMBRE_PAGINA || "UAPA SIVEX"}
            </span>
          )}
        </div>

        <div className="list-group list-group-flush flex-grow-1 ps-2 pe-2">
          <Link
            to="/Home_administrator"
            className={`list-group-item list-group-item-action ${isActive(
              "/Home_administrator"
            )} d-flex align-items-center`}
          >
            <i className="bi bi-house-door-fill fs-5 me-2" />
            {!collapsed && <span className="sidebar-text">Inicio</span>}
          </Link>

          {(isAdmin() || isCoordinator()) && (
            <>
              <button
                className={`list-group-item list-group-item-action ${isFormMenuOpen ? "active-submenu" : ""
                  } d-flex align-items-center justify-content-between`}
                onClick={() => setIsFormMenuOpen(!isFormMenuOpen)}
              >
                <div className="d-flex align-items-center">
                  <i className="bi bi-card-checklist fs-5 me-2" />
                  {!collapsed && (
                    <span className="sidebar-text fw-bold">Formularios</span>
                  )}
                </div>

                {!collapsed && (
                  <i
                    className={`bi ${isFormMenuOpen ? "bi-chevron-up" : "bi-chevron-down"
                      }`}
                  />
                )}
              </button>

              {isFormMenuOpen && (
                <div className="ps-3">
                  <Link
                    to="/form/users"
                    className={`list-group-item list-group-item-action ${isActive(
                      "/form/users"
                    )} d-flex align-items-center`}
                  >
                    <i className="bi bi-person-gear fs-5 me-2" />
                    {!collapsed && (
                      <span className="sidebar-text">Usuarios</span>
                    )}
                  </Link>


                  <Link
                    to="/form/projects"
                    className={`list-group-item list-group-item-action ${isActive(
                      "/form/projects"
                    )} d-flex align-items-center`}
                  >
                    <i className="bi bi-pencil-square fs-5 me-2" />
                    {!collapsed && (
                      <span className="sidebar-text">Proyectos</span>
                    )}
                  </Link>


                  <Link
                    to="/form/project-manager"
                    className={`list-group-item list-group-item-action ${isActive(
                      "/form/project-manager"
                    )} d-flex align-items-center`}
                  >
                    <i className="bi bi-pencil fs-5 me-2" />
                    {!collapsed && (
                      <span className="sidebar-text">Responsables</span>
                    )}
                  </Link>



                  <Link
                    to="/form/Enclosures"
                    className={`list-group-item list-group-item-action ${isActive(
                      "/form/Enclosures"
                    )} d-flex align-items-center`}
                  >
                    <i className="bi bi-calendar-check-fill fs-5 me-2" />
                    {!collapsed && (
                      <span className="sidebar-text">Recintos</span>
                    )}
                  </Link>

                  <Link
                    to="/form/type-projects"
                    className={`list-group-item list-group-item-action ${isActive(
                      "/form/type-projects"
                    )} d-flex align-items-center`}
                  >
                    <i className="bi bi-tag-fill fs-5 me-2" />
                    {!collapsed && (
                      <span className="sidebar-text">Tipos de Proyectos</span>
                    )}
                  </Link>
                </div>
              )}
            </>
          )}

          {(isAdmin() || isCoordinator()) && (
            <Link
              to="/reports"
              className={`list-group-item list-group-item-action ${isActive(
                "/reports"
              )} d-flex align-items-center`}
            >
              <i className="bi bi-bar-chart-line-fill fs-5 me-2" />
              {!collapsed && <span className="sidebar-text">Reportes</span>}
            </Link>
          )}
        </div>

        <button
          id="sidebar-logout"
          onClick={() => {
            handleLogout();
            setIsMobileOpen(false);
          }}
          className="list-group-item list-group-item-action bg-transparent border-0 d-flex align-items-center"
          style={{ cursor: "pointer" }}
        >
          <i className="bi bi-box-arrow-left fs-5 me-2" />
          {!collapsed && (
            <span className="sidebar-text text-danger">Cerrar Sesión</span>
          )}
        </button>
      </div>
    </>
  );
};

export default Sidebar;

