// src/components/ProfileUpdateForm.tsx
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useAuth } from "../../context/useAuth";
import {  UpdatedUser } from "../../models/User";
import { getUserByEmail, updateUser } from "../../services/userServices";

const ProfileUpdateForm: React.FC = () => {

  const { user, setUser, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [firstName, setFirstName] = useState("");

  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");

  const [registrationNumber, setRegistrationNumber] = useState("");

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!user || !isAuthenticated || initialized) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const fetchedUser = await getUserByEmail(user.email);

        setFirstName(fetchedUser.firstName ?? "");
        setLastName(fetchedUser.lastName ?? "");
        setEmail(fetchedUser.email ?? "");
        setRegistrationNumber(fetchedUser.registrationNumber ?? "");

        setUser(fetchedUser);
        setInitialized(true);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar los datos del usuario");
        autoClearError();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user, isAuthenticated, setUser, initialized]);

  const autoClearError = () => {
    setTimeout(() => setError(""), 3000);
  };

  const autoClearSuccess = () => {
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!user?.id) {
      setError("No se encontró el ID del usuario.");
      autoClearError();
      return;
    }

    if (!firstName || !lastName) {
      setError("Los campos de nombres y apellidos deben estar completos");
      autoClearError();
      return;
    }

    try {
      setLoading(true);

      const updatedData: UpdatedUser = {
        id: user.id,
        firstName,
        lastName,
        email,
        registrationNumber,
      };
     
      const updatedUser = await updateUser(updatedData);


       //creo que el problema esta qui, Y CREO QUE TENGO RAZON PORQUE YA NO ME REDIRIGE A PAGINA DE NO AUTORIZADO
      //setUser(updatedUser);
      setSuccessMessage("Perfil actualizado correctamente."+updatedUser.firstName);
      autoClearSuccess();
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      setError("Error al actualizar usuario");
      autoClearError();
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return <p>No hay usuario autenticado.</p>;

  if (loading)
    return (
      <div className="text-center mt-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );

  return (
    <div className="container mb-3" style={{ maxWidth: "600px", marginTop: "2rem" }}>
      <h2 className="mb-4">Actualizar Perfil</h2>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
            aria-label="Close"
          ></button>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccessMessage("")}
            aria-label="Close"
          ></button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label fw-bold">
            Nombre
          </label>
          <input
            type="text"
            id="firstName"
            className="form-control"
            value={firstName}
            required
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="lastName" className="form-label fw-bold">
            Apellido
          </label>
          <input
            type="text"
            id="lastName"
            className="form-control"
            required
            value={lastName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-bold">
            Correo electrónico
          </label>
          <input type="email" id="email" className="form-control" value={email} readOnly />
        </div>

        <div className="mb-3">
          <label htmlFor="registrationNumber" className="form-label fw-bold">
            Matrícula
          </label>
          <input type="text" id="registrationNumber" className="form-control" value={registrationNumber} readOnly />
        </div>

        <button type="submit" className="btn btn-primary px-4">
          Actualizar
        </button>
      </form>
    </div>
  );
};

export default ProfileUpdateForm;
