// src/pages/forms/ProjectUpdate.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Define la interfaz del objeto Project para el estado
interface Project {
  id: string;
  title: string;
  description: string;
  responsible: string;
  status: string;
}

const ProjectUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Obtiene el ID de la URL
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Aquí es donde harías la llamada a tu servicio para obtener los datos actuales del proyecto
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        // Simulación de una llamada a la API
        // const fetchedProject = await getProjectById(id);
        const fetchedProject = {
          id: id!,
          title: "Proyecto de Ejemplo para Editar",
          description: "Esta es la descripción que se cargará para ser editada.",
          responsible: "Juan Pérez",
          status: "in-progress",
        };
        setProjectData(fetchedProject);
      } catch (err) {
        setError("No se pudieron cargar los datos del proyecto.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProjectData((prevData) => {
      if (!prevData) return null;
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectData) return;
    console.log("Datos del proyecto a actualizar:", projectData);
    // Aquí harías la llamada a tu servicio para actualizar el proyecto
    // Ejemplo: updateProject(projectData.id, projectData);
    navigate(`/form/view-project/${projectData.id}`);
  };

  if (isLoading) {
    return <div className="text-center mt-5">Cargando datos para editar...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5">{error}</div>;
  }

  if (!projectData) {
    return <div className="alert alert-warning mt-5">Proyecto no encontrado para editar.</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Editar Proyecto</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Título
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={projectData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Descripción
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows={3}
            value={projectData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="responsible" className="form-label">
            Responsable
          </label>
          <input
            type="text"
            className="form-control"
            id="responsible"
            name="responsible"
            value={projectData.responsible}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="status" className="form-label">
            Estado
          </label>
          <select
            className="form-select"
            id="status"
            name="status"
            value={projectData.status}
            onChange={handleChange}
            required
          >
            <option value="pending">Pendiente</option>
            <option value="in-progress">En Progreso</option>
            <option value="completed">Completado</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary me-2">
          Actualizar Proyecto
        </button>
        <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default ProjectUpdate;