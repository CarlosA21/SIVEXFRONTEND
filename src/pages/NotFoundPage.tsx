// src/pages/NotFoundPage.tsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/404.jpg";

const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = import.meta.env.VITE_NOMBRE_PAGINA + " - 404 Not Found";
  }, []);

  
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <img
        src={logo}
        alt="Logo 404"
        style={{
          maxWidth: "300px",
          width: "100%",
          height: "auto",
          marginBottom: "20px",
        }}
      />
      <h1>404 - Página no encontrada</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/">
        {" "}
        <button className="btn btn-primary"> Volver al inicio</button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
