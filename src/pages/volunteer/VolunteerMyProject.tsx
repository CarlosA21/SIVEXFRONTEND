// src/components/VolunteerMyProject.tsx
import React, { useState, useEffect } from "react";
import { Card, Badge, Button, Spinner, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // 👈 Importa useNavigate
import { Project } from "../../models/Project";
import { GetUserEnrollmentsProjects } from "../../services/projectServices";

const VolunteerMyProject: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // 👈 Inicializa useNavigate

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await GetUserEnrollmentsProjects();
        console.log(data);
        setProjects(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar los proyectos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Nueva función para navegar a la página de detalles del proyecto
  const handleGoToProject = (projectId: number) => {
    navigate(`/proyectos/${projectId}`); // 👈 Navega a la nueva ruta
  };

  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "en proceso":
        return "warning";
      case "finalizado":
        return "secondary";
      default:
        return "light";
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Mis Proyectos</h2>

      {error && <p className="text-danger">{error}</p>}

      {projects.length === 0 ? (
        <p className="text-muted">No estás asignado a ningún proyecto.</p>
      ) : (
        <Row xs={1} md={2} className="g-4">
          {projects.map((project) => (
            <Col key={project.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between align-items-center">
                    {project.title}
                    <Badge bg={getBadgeVariant(project.status)}>{project.status}</Badge>
                  </Card.Title>
                  <Card.Text className="text-truncate" style={{ maxHeight: "3.6em" }}>
                    {project.description}
                  </Card.Text>
                  <p className="mb-1">
                    <strong>Inicio:</strong> {project.startDate}
                  </p>
                  {project.endDate && (
                    <p className="mb-1">
                      <strong>Fin:</strong> {project.endDate}
                    </p>
                  )}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleGoToProject(project.id)} // 👈 onClick actualizado
                  >
                    Ir al proyecto
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default VolunteerMyProject;
