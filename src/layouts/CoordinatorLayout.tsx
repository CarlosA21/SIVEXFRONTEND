import React, { useState } from "react";

import Footer from "../components/Footer";
import { useAuth } from "../context/useAuth";
import HeaderCoordinator from "../components/HeaderCoordinator";

interface VolunteerLayoutProps {
  children: React.ReactNode;
}

const CoordinatorLayout: React.FC<VolunteerLayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { loading } = useAuth();

  const handleToggleMenu = () => {
    setIsCollapsed(!isCollapsed);
    setIsMobileOpen(!isMobileOpen);
  };

  const handleContainerClick = () => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
        <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 fs-5">Cargando...</p>
      </div>
    );
  }

  return (
    <div id="wrapper" className="d-flex vh-100">
      {/* <VolunteerSidebar
        collapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      /> */}
      <div id="page-content-wrapper" className="d-flex flex-column flex-grow-1">
        <HeaderCoordinator onToggleMenu={handleToggleMenu}/> {/* Pasar el rol para personalizar el header */}
        <div
          className="container-fluid mt-4 flex-grow-1 p-3 bg-light rounded-3"
          onClick={handleContainerClick}
        >
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default CoordinatorLayout;