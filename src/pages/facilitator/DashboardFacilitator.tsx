import React, { useEffect, useState } from 'react';
import { Card, Row, Col, ListGroup, Badge, Spinner } from 'react-bootstrap';
import { getDashboardData } from '../../services/DashboardFacilitatorService'; // Importa la función de servicio

// Interfaces para tipar los datos
interface Project {
  id: number;
  title: string;
  status: 'active' | 'inactive';
}

interface Notification {
  proyecto?: string;
  actividad?: string;
  voluntario?: string;
  fecha?: string;
  fechaVencimiento?: string;
  mensaje: string;
}

const DashboardFacilitator: React.FC = () => {
  const [proyectos, setProyectos] = useState<Project[]>([]);
  const [notificaciones, setNotificaciones] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboardData();
        setProyectos(data.myProjects);
        setNotificaciones(data.notificaciones);
      } catch (error) {
        // El error ya se maneja en el servicio, aquí solo podrías mostrar un mensaje al usuario.
        console.error('No se pudieron cargar los datos.', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status" variant="primary" />
        <p className="mt-2">Cargando datos del dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4 px-4">
      {/* Título Principal */}
      <h2 className="mb-4 text-primary">📊 Dashboard del Facilitador</h2>

      <Row className="g-4">
        {/* Sección de Proyectos */}
        <Col md={6} lg={5}>
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Mis Proyectos</h5>
              <Badge bg="light" text="primary">
                {proyectos.length}
              </Badge>
            </Card.Header>
            <ListGroup variant="flush">
              {proyectos.length > 0 ? (
                proyectos.map((p) => (
                  <ListGroup.Item
                    key={p.id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <span className="fw-bold">{p.title}</span>
                    <Badge
                      bg={p.status === 'active' ? 'success' : 'secondary'}
                      className="ms-2"
                    >
                      {p.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item className="text-muted text-center">
                  Aún no tienes proyectos asignados.
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>

        {/* Sección de Notificaciones */}
        <Col md={6} lg={7}>
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-warning text-dark d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Notificaciones Recientes</h5>
              <Badge bg="dark" text="white">
                {notificaciones.length}
              </Badge>
            </Card.Header>
            <ListGroup
              variant="flush"
              className="overflow-auto"
              style={{ maxHeight: '400px' }}
            >
              {notificaciones.length > 0 ? (
                notificaciones.map((n, i) => (
                  <ListGroup.Item key={i} className="d-flex flex-column">
                    <div className="d-flex w-100 justify-content-between">
                      <strong className="mb-1">{n.mensaje}</strong>
                      {n.proyecto && (
                        <small className="text-muted ms-2">
                          Proyecto: {n.proyecto}
                        </small>
                      )}
                      {n.voluntario && (
                        <small className="text-muted ms-2">
                          Voluntario: {n.voluntario}
                        </small>
                      )}
                    </div>
                    {n.fecha && <small className="text-muted">{n.fecha}</small>}
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item className="text-muted text-center">
                  No hay nuevas notificaciones.
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardFacilitator;

