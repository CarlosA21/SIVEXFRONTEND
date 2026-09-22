import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import * as projectTypeService from "../../services/project_TypeService";
import { ProjectType, ProjectTypeData } from "../../services/project_TypeService";

const TypeProjectForm: React.FC = () => {
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [filtered, setFiltered] = useState<ProjectType[]>([]);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedProjectType, setSelectedProjectType] = useState<ProjectType | null>(null);

  const [formData, setFormData] = useState<ProjectTypeData>({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCloseCreate = () => {
    setShowCreate(false);
    setFormData({ name: "", description: "" });
  };

  const handleShowCreate = () => {
    setShowCreate(true);
    setMessage("");
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
    setSelectedProjectType(null);
    setMessage("");
  };

  useEffect(() => {
    fetchProjectTypes();
  }, []);

  const fetchProjectTypes = async () => {
    try {
      const data = await projectTypeService.getProjectTypes();
      setProjectTypes(data);
      setFiltered(data);
    } catch (error) {
      console.error("Error al cargar tipos de proyecto", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const result = projectTypes.filter(
      (pt) =>
        pt.name.toLowerCase().includes(value) ||
        pt.description.toLowerCase().includes(value)
    );
    setFiltered(result);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      setMessage("Debe completar todos los campos ❌");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await projectTypeService.createProjectType(formData);
      setMessage("Tipo de proyecto creado exitosamente ✅");
      fetchProjectTypes();
      handleCloseCreate();
    } catch (error) {
      console.error(error);
      setMessage("Error al crear el tipo de proyecto ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pt: ProjectType) => {
    setSelectedProjectType(pt);
    setFormData({ name: pt.name, description: pt.description });
    setShowEdit(true);
    setMessage("");
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectType) {
      setMessage("Debe seleccionar un tipo de proyecto ❌");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await projectTypeService.updateProjectType(selectedProjectType.id, formData);
      setMessage("Tipo de proyecto actualizado ✅");
      fetchProjectTypes();
      handleCloseEdit();
    } catch (error) {
      console.error(error);
      setMessage("Error al actualizar el tipo de proyecto ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este tipo de proyecto?")) return;
    try {
      await projectTypeService.deleteProjectType(id);
      fetchProjectTypes();
    } catch (error) {
      console.error("Error eliminando tipo de proyecto", error);
    }
  };

  return (
    <div id="type-project-form" className="container mt-4">
      <h2 className="mb-3">Gestión de Tipos de Proyecto</h2>
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Buscar por nombre o descripción..."
          value={search}
          onChange={handleSearch}
        />
        <Button variant="primary" onClick={handleShowCreate}>
          Nuevo Tipo
        </Button>
      </div>

      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((pt) => (
            <tr key={pt.id}>
              <td>{pt.id}</td>
              <td>{pt.name}</td>
              <td>{pt.description}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(pt)}>
                  Editar
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(pt.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Crear */}
      <Modal show={showCreate} onHide={handleCloseCreate}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Tipo de Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmitCreate}>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" variant="success" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </form>
          {message && <div className="mt-3 alert alert-info">{message}</div>}
        </Modal.Body>
      </Modal>

      {/* Modal Editar */}
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Tipo de Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmitEdit}>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
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

export default TypeProjectForm;
