// src/pages/VolunteerProjects.tsx
import React, { useState, useEffect } from "react";
import { Project } from "../../models/Project";
import {
  GetAllProjects,
  RequestEnrollment,
} from "../../services/projectServices";
import { Modal, Button, Badge, Spinner, Alert } from "react-bootstrap";

// Definiciones de tipos
interface User {
  id: number;
  name: string;
  role: "Volunteer" | "Admin" | "Director";
}

const VolunteerProjects: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Estados separados
  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);
  const [loadingEnrollment, setLoadingEnrollment] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Traducción de tipos de proyecto
  const formatProjectType = (type: Project["projectType"]) => {
    switch (type) {
      case "extensionism":
        return "Extensionismo";
      case "volunteering":
        return "Voluntariado";
      default:
        return "Desconocido";
    }
  };

  useEffect(() => {
    const loadProjects = async () => {
      try {
        // 👉 Aquí deberías obtener al usuario autenticado desde tu backend o contexto
        // Ejemplo: const currentUser = await GetCurrentUser();
        // if (!currentUser || currentUser.role !== "Volunteer") return;
        // setUser(currentUser);

        // ⚠️ Mientras tanto, asumimos que ya tienes al usuario en el backend
        // y que la API de proyectos devuelve solo los que puede ver.
        setUser({ id: 1, name: "Usuario autenticado", role: "Volunteer" });

        const projects = await GetAllProjects(setLoadingProjects);
        const filtered = projects.filter((p) => p.status === "active");
        setActiveProjects(filtered);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoadingProjects(false);
      }
    };

    loadProjects();
  }, []);

  const handleViewProject = (projectId: number) => {
    const project = activeProjects.find((p) => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setIsModalOpen(true);
      setSuccessMessage(null);
    }
  };

  const handleRequestEnrollment = async () => {
    if (!selectedProject) return;

    try {
      setLoadingEnrollment(true);
      const response = await RequestEnrollment(
        selectedProject.id,
        setLoadingEnrollment
      );
      setSuccessMessage("Solicitud enviada con éxito ✅ " + response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoadingEnrollment(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  // Spinner de carga de proyectos
  if (loadingProjects) {
    return (
      <div className="container mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Cargando proyectos...</p>
      </div>
    );
  }

  // Error global
  if (error) {
    return (
      <div className="container mt-5">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  // Si no hay usuario cargado
  if (!user) {
    return (
      <div className="container mt-5">
        <Alert variant="danger">No se pudo cargar el usuario.</Alert>
      </div>
    );
  }

  return (
    <>
      <main className="container mt-4">
        <h2 className="mb-4">Proyectos Activos</h2>
        <div className="row g-4">
          {activeProjects.length === 0 ? (
            <p className="text-muted">
              Actualmente no hay proyectos activos disponibles.
            </p>
          ) : (
            activeProjects.map((project) => (
              <div className="col-md-6" key={project.id}>
                <div className="card shadow-sm h-100">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">
                      {project.title} <Badge bg="success">Activo</Badge>
                    </h5>
                    <p className="card-text text-muted">
                      {project.description}
                    </p>
                    <Button
                      variant="outline-primary"
                      className="mt-auto"
                      onClick={() => handleViewProject(project.id)}
                    >
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Modal con React-Bootstrap */}
      <Modal
        show={isModalOpen}
        onHide={closeModal}
        centered
        size="lg"
        backdrop="static"
      >
        {selectedProject && (
          <>
            <Modal.Header closeButton className="bg-primary text-white">
              <Modal.Title>{selectedProject.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                <strong>Descripción:</strong>{" "}
                <span className="text-muted">{selectedProject.description}</span>
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                <Badge bg="success">{selectedProject.status}</Badge>
              </p>
              <p>
                <strong>Fecha inicio:</strong>{" "}
                {new Date(selectedProject.startDate).toLocaleDateString()}
              </p>
              {selectedProject.endDate && (
                <p>
                  <strong>Fecha fin:</strong>{" "}
                  {new Date(selectedProject.endDate).toLocaleDateString()}
                </p>
              )}
              <p>
                <strong>Tipo de proyecto:</strong>{" "}
                {formatProjectType(selectedProject.projectType)}
              </p>

              {successMessage && (
                <Alert variant="success" className="mt-3">
                  {successMessage}
                </Alert>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>
                Cerrar
              </Button>
              <Button
                variant="primary"
                onClick={handleRequestEnrollment}
                disabled={loadingEnrollment}
              >
                {loadingEnrollment ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Enviando...
                  </>
                ) : (
                  "Solicitar unirse al proyecto"
                )}
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
};

export default VolunteerProjects;

