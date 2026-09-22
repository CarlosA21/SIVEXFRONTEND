import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { confirmPasswordReset } from "../../services/authService";
import { toast } from "react-toastify";
import forgotPaswordImage from "../../assets/images/ForgotPassword.png"

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== newPasswordConfirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (!token) {
      setError("Token no presente en la URL");
      return;
    }

    try {
      const response = await confirmPasswordReset(token, newPassword);
      if (response.message === "Password reset successfully") {
        toast.success("¡Contraseña restablecida exitosamente!", {
          position: "top-center",
          autoClose: 3000,
        });
        navigate("/auth/login");
      } else {
        setError(
          "No se pudo restablecer la contraseña. El token está vencido o es inválido."
        );
      }
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al restablecer la contraseña.");
    }
  };

  useEffect(() => {
    if (newPassword !== newPasswordConfirm) {
      setError("Las contraseñas no coinciden");
    } else setError("");
  }, [newPassword, newPasswordConfirm]);

  return (
    <div className="container my-5">
      <div className="row justify-content-center align-items-center">
        {/* Imagen */}
        <div className="col-md-6 mb-4 text-center">
          <img
            src={forgotPaswordImage}
            alt="Restablecer contraseña"
            className="img-fluid"
          />
        </div>

        {/* Formulario */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h2 className="text-center mb-3">SIVEX</h2>
            <p className="text-center text-muted mb-4">
              Ingresa tu nueva contraseña
            </p>

            {error && (
              <div className="alert alert-danger text-center">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="form-control"
                  placeholder="********"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="newPasswordConfirm" className="form-label">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  id="newPasswordConfirm"
                  className="form-control"
                  placeholder="********"
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  required
                />
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Restablecer Contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
