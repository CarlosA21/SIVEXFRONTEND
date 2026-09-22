import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, resetPassword } from "../../../services/authService";
import { register } from "../../../services/userServices";
import { useAuth } from "../../../context/useAuth";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { DtoNewUser } from "../../../dtos/DtoNewUser";
import logoSivex from "../../../assets/images/LOGO_SIVEX_LOGIN.jpg";

interface RolePayload {
  id: number;
  name: string;
}

interface TokenPayload {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: RolePayload;
  iat?: number;
  exp?: number;
}

type AuthMode = "Login" | "Register" | "ForgotPassword";

const Login: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [enrollment, setEnrollment] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useAuth();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

  const validatePassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);

  // ================================
  // LOGIN
  // ================================
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneralError("");
    setEmailError("");
    setPasswordError("");

    if (!validateEmail(email)) {
      setEmailError("Correo electrónico inválido.");
      setIsLoading(false);
      return;
    }
    if (!password) {
      setPasswordError("Ingresa tu contraseña.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await login({ email, password });
      const token = response.access_token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode<TokenPayload>(token);

      setUser({
        id: decoded.id,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        email: decoded.email,
        role: decoded.role,
      });
      setIsAuthenticated(true);

      switch (decoded.role.name) {
        case "ADMINISTRATOR":
          navigate("/Home_administrator");
          break;
        case "VOLUNTEER":
          navigate("/volunteer/dashboard");
          break;
        case "COORDINATOR":
          navigate("/dashboardCoordinator");
          break;
        case "FACILITATOR":
          navigate("/facilitator/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch {
      setGeneralError("Credenciales inválidas. Intenta de nuevo.");
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // ================================
  // REGISTER
  // ================================
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    if (!validateEmail(email)) {
      setEmailError("Correo electrónico inválido.");
      setIsLoading(false);
      return;
    }
    if (!validatePassword(password)) {
      setPasswordError(
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número."
      );
      setIsLoading(false);
      return;
    }
    if (!firstName || !lastName || !enrollment) {
      setGeneralError("Por favor completa todos los campos.");
      setIsLoading(false);
      return;
    }

    try {
      const newUser: DtoNewUser = {
        firstName,
        lastName,
        registrationNumber: enrollment,
        email,
        password,
        status: "active",
        //roleId: NaN,
      };
      await register(newUser);
      toast.success("Registro exitoso. Ahora inicia sesión.");
      setAuthMode("Login");
    } catch {
      setGeneralError("Error en el registro.");
    } finally {
      setIsLoading(false);
    }
  };

  // ================================
  // FORGOT PASSWORD
  // ================================
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailError("");
    setGeneralError("");

    if (!validateEmail(email)) {
      setEmailError("Correo electrónico inválido.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await resetPassword(email);
      if (response.message) {
        toast.success("Se envió un correo con las instrucciones.");
        setAuthMode("Login");
      }
    } catch {
      setGeneralError("Error al enviar el correo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="row">
      {/* Columna Imagen */}
      <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-primary">
        <img src={logoSivex} alt="SIVEX" className="img-fluid p-4" />
      </div>

      {/* Columna Formulario */}
      <div className="col-md-6 p-5">
        {authMode === "Login" && (
          <>
            <h2 className="text-primary fw-bold mb-4 text-center">SIVEX</h2>
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-3">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className={`form-control ${emailError && "is-invalid"}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && (
                  <div className="invalid-feedback">{emailError}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className={`form-control ${passwordError && "is-invalid"}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && (
                  <div className="invalid-feedback">{passwordError}</div>
                )}
              </div>
              {generalError && (
                <div className="alert alert-danger">{generalError}</div>
              )}
              <button className="btn btn-primary w-100" disabled={isLoading}>
                {isLoading ? "Cargando..." : "Ingresar"}
              </button>
            </form>

            <div className="text-center mt-3">
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => setAuthMode("Register")}
              >
                Crear cuenta
              </button>
              {" | "}
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => setAuthMode("ForgotPassword")}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </>
        )}

        {authMode === "Register" && (
          <>
            <h2 className="text-success fw-bold mb-4 text-center">Registro</h2>
            <form onSubmit={handleRegisterSubmit}>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Apellido</label>
                <input
                  type="text"
                  className="form-control"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Matrícula</label>
                <input
                  type="text"
                  className="form-control"
                  value={enrollment}
                  onChange={(e) => setEnrollment(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className={`form-control ${emailError && "is-invalid"}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && (
                  <div className="invalid-feedback">{emailError}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className={`form-control ${passwordError && "is-invalid"}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && (
                  <div className="invalid-feedback">{passwordError}</div>
                )}
              </div>
              {generalError && (
                <div className="alert alert-danger">{generalError}</div>
              )}
              <button className="btn btn-success w-100" disabled={isLoading}>
                {isLoading ? "Registrando..." : "Registrar"}
              </button>
            </form>
            <div className="text-center mt-3">
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => setAuthMode("Login")}
              >
                ¿Ya tienes cuenta? Inicia sesión
              </button>
            </div>
          </>
        )}

        {authMode === "ForgotPassword" && (
          <>
            <h2 className="text-warning fw-bold mb-4 text-center">
              Recuperar Contraseña
            </h2>
            <form onSubmit={handleForgotPasswordSubmit}>
              <div className="mb-3">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className={`form-control ${emailError && "is-invalid"}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && (
                  <div className="invalid-feedback">{emailError}</div>
                )}
              </div>
              {generalError && (
                <div className="alert alert-danger">{generalError}</div>
              )}
              <button className="btn btn-warning w-100" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar correo de recuperación"}
              </button>
            </form>
            <div className="text-center mt-3">
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => setAuthMode("Login")}
              >
                Volver al login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;

