// src/components/ProjectDetails.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Spinner,
  Alert,
  Card,
  Badge,
  Col, // Importar Col
  Row  // Importar Row
} from "react-bootstrap";
import { Project, Activity } from "../../models/Project";
//import { Activity } from "../../models/Activity";
// Ya no necesitamos GetProjectActivities si la API devuelve actividades en el proyecto
// import { GetProjectById, GetProjectActivities } from "../../services/projectServices";
import { GetProjectById_v2 } from "../../services/projectServices"; // Usaremos una versión adaptada
import UploadEvidence from "./UploadEvidence"; // Asumimos que este componente ya existe

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!projectId) {
        setError("ID del proyecto no encontrado.");
        setLoading(false);
        return;
      }

      try {
        // Llama a la nueva función del servicio que trae todo junto
        const projectData = await GetProjectById_v2(projectId);
        setProject(projectData);
        // Las actividades ya vienen en projectData.activities
      } catch (err: any) {
        setError(err.message || "Error al cargar los detalles del proyecto.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const getBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) { // Usar ?. para seguridad
      case "active":
        return "success";
      case "en proceso":
        return "warning";
      case "finalizado":
        return "secondary";
      case "pending": // Para actividades
        return "info";
      case "in_progress": // Para actividades
        return "warning";
      default:
        return "light";
    }
  };

  // Función para obtener la fecha formateada o mostrar un texto alternativo
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "No especificada";
    try {
      // Intenta formatear la fecha. Asume que la fecha viene en formato YYYY-MM-DD
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return dateString; // Si falla el formato, muestra la original
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="mt-5">{error}</Alert>;
  }

  if (!project) {
    return <Alert variant="info" className="mt-5">Proyecto no encontrado.</Alert>;
  }

  return (
    <Container className="mt-4">
      {/* Sección de Información del Proyecto */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title className="d-flex justify-content-between align-items-center flex-wrap"> {/* flex-wrap para adaptabilidad */}
            <h1 className="mb-2">{project.title}</h1> {/* mb-2 para espacio */}
            <Badge bg={getBadgeVariant(project.status)} className="mb-2">{project.status}</Badge>
          </Card.Title>
          <Card.Text>{project.description}</Card.Text>
          <hr />
          <Row> {/* Usamos Row y Col para organizar las fechas */}
            <Col md={6} className="mb-2">
              <strong>Inicio:</strong> {formatDate(project.startDate)}
            </Col>
            {project.endDate && (
              <Col md={6} className="mb-2">
                <strong>Fin:</strong> {formatDate(project.endDate)}
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>

      {/* Sección de Actividades */}
      <h2 className="mb-3">Actividades del Proyecto</h2>
      {project.activities && project.activities.length === 0 ? ( // Verifica si project.activities existe
        <Alert variant="info">No hay actividades asignadas a este proyecto.</Alert>
      ) : (
        <Row xs={1} md={2} className="g-4"> {/* Estructura similar a la lista de proyectos */}
          {project.activities?.map((activity) => (
            <Col key={activity.id}>
              <Card
                className={`h-100 shadow-sm cursor-pointer ${activeActivity?.id === activity.id ? 'border-primary' : ''}`}
                onClick={() => setActiveActivity(activity)}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-1">{activity.name}</h5>
                    <Badge bg={getBadgeVariant(activity.status)}>{activity.status}</Badge>
                  </div>
                  <Card.Text className="text-muted text-truncate" style={{ maxHeight: "2.4em" }}> {/* Limitar altura para que no varíe tanto */}
                    {activity.description}
                  </Card.Text>
                  <small className="text-muted">Fecha: {formatDate(activity.date)}</small>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Detalles de la Actividad y Sección de Subida de Evidencia */}
      {activeActivity && (
        <Card className="mt-4 shadow-sm">
          <Card.Header>
            <h4 className="mb-0">{activeActivity.name}</h4>
          </Card.Header>
          <Card.Body>
            <p>{activeActivity.description}</p>
            <p className="text-muted">Fecha: {formatDate(activeActivity.date)}</p>
            <hr />
            <UploadEvidence activityId={Number(activeActivity.id)} />
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default ProjectDetails;