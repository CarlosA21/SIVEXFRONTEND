import React, { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onToggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleMenu }) => {
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false); // Renamed for clarity
  const { user, setUser, isAuthenticated, setIsAuthenticated } = useAuth();
  const [fullName, setFullName] = useState("Sin Usuario");
  const [roleName, setRoleName] = useState("");

  const [isMenuOpen, setMenuOpen] = useState(true); // State for the toggle button icon
  const navigate = useNavigate();

  const handleButtonMenu = () => {
    setMenuOpen(!isMenuOpen);
    onToggleMenu();
  };

  useEffect(() => {
    if (user) {
      setFullName(`${user.firstName} ${user.lastName}`);
      setRoleName(user.role?.name || "sin rol");
    }
  }, [user]);

  useEffect(() => {
    function checkMobile() {
      setIsMobileMenuVisible(window.innerWidth <= 768);
    }
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleLogout = () => {
    if (isAuthenticated) {
      setIsAuthenticated(false);
      setUser(null);
      navigate("/auth/login");
    }
    localStorage.removeItem("token");
  };

  const handleProfile = () => {
    if (isAuthenticated) {
      navigate("/profile");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm"> {/* Added background and shadow */}
      
      <div className="container-fluid">
        
        {!isMobileMenuVisible && (
          <button className="btn btn-outline-secondary me-3" onClick={handleButtonMenu} aria-label="Toggle Menu">
            <i className={`bi ${isMenuOpen ? "bi-chevron-double-right" : "bi-chevron-double-left"}`} style={{ fontSize: "1.5rem" }}></i>
          </button>
        )}

        <div className="dropdown ms-auto">
          <button
            className="btn btn-link dropdown-toggle text-decoration-none d-flex align-items-center"
            id="userDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <div className="me-2 text-end"> {/* Aligned text to the right */}
              <span className="fw-bold d-block" style={{ fontSize: "0.9rem" }}>{fullName}</span>
              <span className="small text-muted" style={{ fontSize: "0.8rem" }}>{roleName}</span>
            </div>
            <i className="bi bi-person-circle fs-3"></i> {/* Larger user icon */}
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
    </nav>
  );
};

export default Header;