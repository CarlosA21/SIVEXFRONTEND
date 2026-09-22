import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg w-100" style={{ maxWidth: "900px" }}>
        <div className="row g-0">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;

