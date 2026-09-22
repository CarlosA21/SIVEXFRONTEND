import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserService, { IUser, IUserUpdate } from "../../services/UserService";

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser | null>(null);
  const [formData, setFormData] = useState<IUserUpdate>({
    firstName: "",
    lastName: "",
    registrationNumber: "",
    email: "",
    status: "active",
    role: 1,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        const userData = await UserService.getUserById(parseInt(id));
        setUser(userData);
        setFormData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          registrationNumber: userData.registrationNumber,
          email: userData.email,
          status: userData.status,
          role: userData.role.id,
        });
        setError(null);
      } catch {
        setError("Error al cargar los datos del usuario.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "role" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await UserService.updateUser(parseInt(id), formData);
      alert("Usuario actualizado correctamente!");
      navigate("/form/users");
    } catch {
      setError("Error al actualizar el usuario.");
    }
  };

  if (loading)
    return <div className="text-center p-5">Cargando datos del usuario... ⏳</div>;
  if (error || !user)
    return (
      <div className="alert alert-danger text-center">
        {error || "Usuario no encontrado."} 😞
      </div>
    );

  return (
    <div className="container my-5">
      <h1 className="mb-4">
        Editar Usuario: {user.firstName} {user.lastName}
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Apellido</label>
          <input
            type="text"
            className="form-control"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Número de Registro</label>
          <input
            type="text"
            className="form-control"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Estado</label>
          <select
            className="form-select"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Rol</label>
          <select
            className="form-select"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value={1}>ADMINISTRATOR</option>
            <option value={2}>FACILITATOR</option>
            <option value={3}>VOLUNTEER</option>
            <option value={4}>COORDINATOR</option>
            <option value={5}>SCHOOL DIRECTOR</option>
          </select>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button type="submit" className="btn btn-primary">
            Guardar Cambios
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/form/users")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
