// src/components/facilitador/ReportesEstadisticas.tsx
import React, { useEffect, useState } from "react";
import { Card, Row, Col, ProgressBar, Spinner, Alert } from "react-bootstrap";
import { fetchProjectSummary, ProjectSummary } from "../../services/reports.service";

const StatisticsReports: React.FC = () => {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProjectSummary();
        setProjects(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Cargando estadísticas...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="mt-3">{error}</Alert>;
  }

  const actividadesPorEstado = projects.reduce(
    (acc, project) => {
      acc.Pendientes += project.pending_activities;
      acc["En Proceso"] += project.in_progress_activities;
      acc.Finalizadas += project.completed_activities;
      return acc;
    },
    { Pendientes: 0, "En Proceso": 0, Finalizadas: 0 }
  );

  const voluntariosPorProyecto = projects.map((p) => ({
    nombre: p.project_title,
    voluntarios: p.total_volunteers,
  }));

  const totalActividades = Object.values(actividadesPorEstado).reduce(
    (sum, val) => sum + val,
    0
  );

  const totalVoluntarios = voluntariosPorProyecto.reduce(
    (sum, val) => sum + val.voluntarios,
    0
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center text-primary">📈 Reportes y Estadísticas</h2>
      <Row className="g-4">
        {/* Card: Actividades por Estado */}
        <Col md={6}>
          <Card className="h-100 shadow-sm border-0 animate__animated animate__fadeIn">
            <Card.Header className="bg-primary text-white text-center">
              <h5 className="my-1">Actividades por Estado</h5>
            </Card.Header>
            <Card.Body>
              {Object.entries(actividadesPorEstado).map(([estado, cantidad]) => {
                const porcentaje = totalActividades > 0 ? (cantidad / totalActividades) * 100 : 0;
                const variant = estado === "Pendientes" ? "warning" : estado === "En Proceso" ? "info" : "success";

                return (
                  <div key={estado} className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>{estado}</span>
                      <span className="fw-bold">{cantidad}</span>
                    </div>
                    <ProgressBar
                      now={porcentaje}
                      label={`${porcentaje.toFixed(0)}%`}
                      variant={variant}
                      animated
                      striped
                      className="mt-1"
                    />
                  </div>
                );
              })}
            </Card.Body>
          </Card>
        </Col>

        {/* Card: Voluntarios por Proyecto */}
        <Col md={6}>
          <Card className="h-100 shadow-sm border-0 animate__animated animate__fadeIn">
            <Card.Header className="bg-info text-white text-center">
              <h5 className="my-1">Voluntarios por Proyecto</h5>
            </Card.Header>
            <Card.Body>
              {voluntariosPorProyecto.map((act, i) => {
                const porcentaje = totalVoluntarios > 0 ? (act.voluntarios / totalVoluntarios) * 100 : 0;
                return (
                  <div key={i} className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold">{act.nombre}</span>
                      <span className="text-muted">{act.voluntarios} voluntarios</span>
                    </div>
                    <ProgressBar
                      now={porcentaje}
                      label={`${porcentaje.toFixed(0)}%`}
                      variant="primary"
                      animated
                      striped
                      className="mt-1"
                    />
                  </div>
                );
              })}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsReports;


