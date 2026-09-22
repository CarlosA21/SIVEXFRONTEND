import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService, { IUser, INewUser } from "../../services/UserService";

const UserAll: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const navigate = useNavigate();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // 🔹 Paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 6;

  const [newUserData, setNewUserData] = useState<INewUser>({
    firstName: "",
    lastName: "",
    registrationNumber: "",
    email: "",
    password: "",
    status: "active",
    roleId: 1,
  });

  const [searchTerm, setSearchTerm] = useState("");

  // 👇 nuevo estado para modal de error
  const [showErrorModal, setShowErrorModal] = useState(false);

  const fetchUsers = async (page: number = 1) => {
    try {
      setLoading(true);
      const res = await UserService.getAllUsers(page, limit);
      setUsers(res.data);
      setFilteredUsers(res.data);
      setCurrentPage(res.page);
      setTotalPages(res.lastPage);
      setError(null);
    } catch {
      setError("Error al cargar los usuarios. Asegúrate de estar autenticado.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleDetailsClick = (user: IUser) => setSelectedUser(user);

  const handleEditClick = (id: number) => navigate(`/edit-user/${id}`);

  const handleChangeStatus = async (id: number) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    const newStatus = user.status === "active" ? "inactive" : "active";
    if (window.confirm(`¿Cambiar estado de ${user.firstName} a "${newStatus}"?`)) {
      try {
        await UserService.updateUserStatus(id, newStatus);
        fetchUsers();
      } catch {
        alert("Error al actualizar estado.");
      }
    }
  };

  const handleDelete = async (id: number) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    if (window.confirm(`¿Eliminar a ${user.firstName} ${user.lastName}?`)) {
      try {
        await UserService.deleteUser(id);
        setUsers(users.filter((u) => u.id !== id));
        setFilteredUsers(filteredUsers.filter((u) => u.id !== id));
      } catch {
        alert("Error al eliminar.");
      }
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
      return;
    }
    try {
      const results = await UserService.searchUsersByName(searchTerm);
      setFilteredUsers(results);
    } catch {
      setError("Error al buscar usuarios.");
      setShowErrorModal(true);

      setTimeout(() => {
        setShowErrorModal(false);
        setFilteredUsers(users); // restaurar lista
        setError(null);
      }, 3000);
    }
  };

  const handleNewUserChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewUserData((prev) => ({
      ...prev,
      [name]: name === "roleId" ? parseInt(value) : value,
    }));
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await UserService.createUser(newUserData);
      setIsCreateModalOpen(false);
      fetchUsers();
    } catch {
      setCreateError("Error al crear el usuario. Verifica los datos.");
    }
  };

  if (loading) return <div className="text-center p-5">Cargando usuarios...</div>;

  return (
    <div id="user-all" className="container my-4">
      <h1 className="mb-4">Usuarios</h1>

      {/* Search + Create */}
      <div className="d-flex justify-content-between mb-3">
        <div className="input-group w-50">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-outline-primary" onClick={handleSearch}>
            Buscar
          </button>
        </div>
        <button
          className="btn btn-success"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Nuevo Usuario +
        </button>
      </div>

      {/* Tabla de Usuarios */}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Registro</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    {user.firstName} {user.lastName}
                  </td>
                  <td>{user.registrationNumber}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="badge bg-info">{user.role.name}</span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        user.status === "active" ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm" role="group">
                      <button
                        className="btn btn-outline-info"
                        onClick={() => handleDetailsClick(user)}
                      >
                        Detalles
                      </button>
                      <button
                        className="btn btn-outline-warning"
                        onClick={() => handleEditClick(user.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => handleChangeStatus(user.id)}
                      >
                        Estado
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleDelete(user.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center text-muted">
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
<nav className="d-flex justify-content-center mt-3">
  <ul className="pagination">
    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
      <button
        className="page-link"
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      >
        Anterior
      </button>
    </li>

    {[...Array(totalPages)].map((_, i) => (
      <li
        key={i}
        className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
      >
        <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
          {i + 1}
        </button>
      </li>
    ))}

    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
      <button
        className="page-link"
        onClick={() =>
          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
        }
      >
        Siguiente
      </button>
    </li>
  </ul>
</nav>

      {/* Modal Detalles */}
      {selectedUser && (
        <div className="modal fade show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Detalles de {selectedUser.firstName} {selectedUser.lastName}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedUser(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>ID:</strong> {selectedUser.id}</p>
                <p><strong>Registro:</strong> {selectedUser.registrationNumber}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Rol:</strong> {selectedUser.role.name}</p>
                <p><strong>Estado:</strong> {selectedUser.status}</p>
                <p><strong>Creado en:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedUser(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear */}
      {isCreateModalOpen && (
        <div className="modal fade show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleCreateUser}>
                <div className="modal-header">
                  <h5 className="modal-title">Crear Nuevo Usuario</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setIsCreateModalOpen(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={newUserData.firstName}
                      onChange={handleNewUserChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Apellido</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={newUserData.lastName}
                      onChange={handleNewUserChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Número de Registro</label>
                    <input
                      type="text"
                      className="form-control"
                      name="registrationNumber"
                      value={newUserData.registrationNumber}
                      onChange={handleNewUserChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={newUserData.email}
                      onChange={handleNewUserChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={newUserData.password}
                      onChange={handleNewUserChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <select
                      className="form-select"
                      name="status"
                      value={newUserData.status}
                      onChange={handleNewUserChange}
                    >
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Rol</label>
                    <select
                      className="form-select"
                      name="roleId"
                      value={newUserData.roleId}
                      onChange={handleNewUserChange}
                    >
                      <option value={1}>ADMINISTRATOR</option>
                      <option value={2}>FACILITATOR</option>
                      <option value={3}>VOLUNTEER</option>
                      <option value={4}>COORDINATOR</option>
                      <option value={5}>SCHOOL DIRECTOR</option>
                    </select>
                  </div>
                  {createError && (
                    <div className="alert alert-danger">{createError}</div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Crear Usuario
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Error en búsqueda */}
      {showErrorModal && (
        <div className="modal fade show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">❌ Error</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => {
                    setShowErrorModal(false);
                    setFilteredUsers(users);
                    setError(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>{error}</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowErrorModal(false);
                    setFilteredUsers(users);
                    setError(null);
                  }}
                >
                  Cerrar ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAll;