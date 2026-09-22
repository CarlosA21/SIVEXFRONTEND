// src/pages/UnauthorizedPage.tsx
// src/pages/NotFoundPage.tsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/notautorized.jpg";

const UnauthorizedPage: React.FC = () => {
  useEffect(() => {
    document.title =
      import.meta.env.VITE_NOMBRE_PAGINA + " - 401 UnauthorizedPage";
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
      <h1>401 - Página no Autorizada</h1>
      <p>no tienes permiso para acceder a esta sección.</p>
      <Link to="/">
        {" "}
        <button className="btn btn-sigescal"> Volver al inicio</button>
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
