// src/pages/EnclosuresForm.tsx
import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { EnclosureService, Enclosure, Director } from "../../services/enclosureService";

const EnclosuresForm: React.FC = () => {
  const [enclosures, setEnclosures] = useState<Enclosure[]>([]);
  const [filtered, setFiltered] = useState<Enclosure[]>([]);
  const [search, setSearch] = useState("");
  const [directors, setDirectors] = useState<Director[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedEnclosure, setSelectedEnclosure] = useState<Enclosure | null>(null);

  const [enclosureData, setEnclosureData] = useState<{ name: string; directorId: number | null }>({
    name: "",
    directorId: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ------------------- Modales -------------------
  const handleCloseCreate = () => {
    setShowCreate(false);
    setEnclosureData({ name: "", directorId: null });
  };
  const handleShowCreate = () => {
    setShowCreate(true);
    setEnclosureData({ name: "", directorId: null });
  };
  const handleCloseEdit = () => {
    setShowEdit(false);
    setSelectedEnclosure(null);
    setEnclosureData({ name: "", directorId: null });
  };

  // ------------------- Cargar datos -------------------
  useEffect(() => {
    fetchEnclosures();
    fetchDirectors();
  }, []);

  const fetchEnclosures = async () => {
    try {
      const data = await EnclosureService.getAll();
      setEnclosures(data);
      setFiltered(data);
    } catch (error) {
      console.error("Error al cargar recintos", error);
    }
  };

  const fetchDirectors = async () => {
    try {
      const data = await EnclosureService.getDirectors();
      setDirectors(data);
    } catch (error) {
      console.error("Error al cargar directores", error);
    }
  };

  // ------------------- Búsqueda -------------------
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const result = enclosures.filter(
      (enc) =>
        enc.name.toLowerCase().includes(value) ||
        (enc.director &&
          `${enc.director.firstName} ${enc.director.lastName}`.toLowerCase().includes(value))
    );
    setFiltered(result);
  };

  // ------------------- Formularios -------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEnclosureData((prev) => ({
      ...prev,
      [name]: name === "directorId" ? (value ? Number(value) : null) : value,
    }));
  };

  // Crear recinto
  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enclosureData.directorId) {
      setMessage("Debe seleccionar un director ❌");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await EnclosureService.create({ name: enclosureData.name, directorId: enclosureData.directorId });
      setMessage("Recinto creado exitosamente ✅");
      fetchEnclosures();
      handleCloseCreate();
    } catch (error) {
      console.error(error);
      setMessage("Error al crear el recinto ❌");
    } finally {
      setLoading(false);
    }
  };

  // Editar recinto
  const handleEdit = (enc: Enclosure) => {
    setSelectedEnclosure(enc);
    setEnclosureData({ name: enc.name, directorId: enc.director ? enc.director.id : null });
    setShowEdit(true);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnclosure || !enclosureData.directorId) {
      setMessage("Debe seleccionar un director ❌");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await EnclosureService.update(selectedEnclosure.id, {
        name: enclosureData.name,
        directorId: enclosureData.directorId,
      });
      setMessage("Recinto actualizado ✅");
      fetchEnclosures();
      handleCloseEdit();
    } catch (error) {
      console.error(error);
      setMessage("Error al actualizar el recinto ❌");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar recinto
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este recinto?")) return;
    try {
      await EnclosureService.delete(id);
      fetchEnclosures();
    } catch (error) {
      console.error("Error eliminando recinto", error);
    }
  };

  // ------------------- Render -------------------
  return (
    <div id="enclosures-form" className="container mt-4">
      <h2 className="mb-3">Gestión de Recintos</h2>
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Buscar por recinto o director..."
          value={search}
          onChange={handleSearch}
        />
        <Button variant="primary" onClick={handleShowCreate}>
          Nuevo Recinto
        </Button>
      </div>

      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Director</th>
            <th>Email Director</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((enc) => (
            <tr key={enc.id}>
              <td>{enc.id}</td>
              <td>{enc.name}</td>
              <td>
                {enc.director
                  ? `${enc.director.firstName} ${enc.director.lastName}`
                  : "Sin asignar"}
              </td>
              <td>{enc.director?.email || "N/A"}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(enc)}
                >
                  Editar
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(enc.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ------------------- Modal Crear ------------------- */}
      <Modal show={showCreate} onHide={handleCloseCreate}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Recinto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmitCreate}>
            <div className="mb-3">
              <label className="form-label">Nombre del Recinto</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={enclosureData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Director</label>
              <select
                className="form-select"
                name="directorId"
                value={enclosureData.directorId ?? ""}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un director</option>
                {directors.map((dir) => (
                  <option key={dir.id} value={dir.id}>
                    {dir.firstName} {dir.lastName} ({dir.email})
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" variant="success" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </form>
          {message && <div className="mt-3 alert alert-info">{message}</div>}
        </Modal.Body>
      </Modal>

      {/* ------------------- Modal Editar ------------------- */}
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Recinto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmitEdit}>
            <div className="mb-3">
              <label className="form-label">Nombre del Recinto</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={enclosureData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Director</label>
              <select
                className="form-select"
                name="directorId"
                value={enclosureData.directorId ?? ""}
                onChange={handleChange}
                required
              >
                {selectedEnclosure?.director && (
                  <option value={selectedEnclosure.director.id}>
                    Mantener director actual: {selectedEnclosure.director.firstName}{" "}
                    {selectedEnclosure.director.lastName} ({selectedEnclosure.director.email})
                  </option>
                )}
                <option value="">Seleccione un director</option>
                {directors.map((dir) => (
                  <option key={dir.id} value={dir.id}>
                    {dir.firstName} {dir.lastName} ({dir.email})
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" variant="warning" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar"}
            </Button>
          </form>
          {message && <div className="mt-3 alert alert-info">{message}</div>}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EnclosuresForm;
