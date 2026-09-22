// src/components/VolunteerApplications.tsx
import React, { useEffect, useState } from "react";
import { Table, Badge, Spinner, Alert } from "react-bootstrap";
import { GetVolunteerApplications } from "../../services/projectServices";

interface Project {
  id: number;
  title: string;
}

interface Application {
  id: number;
  status: string;
  createdAt: string;
  project: Project | null; // <-- puede venir null desde el backend
}

const VolunteerApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await GetVolunteerApplications(setLoading);
        setApplications(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar las solicitudes.");
      }
    };
    fetchApplications();
  }, []);

  const getBadgeVariant = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "active":
        return "warning";
      case "accepted":
        return "success";
      case "inactive":
        return "danger";
      default:
        return "secondary";
    }
  };

  if (loading) return <Spinner animation="border" />;

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <h2>Mis Solicitudes</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Proyecto</th>
            <th>Estado</th>
            <th>Fecha de Solicitud</th>
          </tr>
        </thead>
        <tbody>
          {applications.length > 0 ? (
            applications.map((app, index) => (
              <tr key={app.id}>
                <td>{index + 1}</td>
                <td>{app.project?.title || "Proyecto no disponible"}</td>
                <td>
                  <Badge bg={getBadgeVariant(app.status)}>
                    {app.status}
                  </Badge>
                </td>
                <td>
                  {app.createdAt
                    ? new Date(app.createdAt).toLocaleDateString()
                    : "Fecha no disponible"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center">
                No tienes solicitudes registradas.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default VolunteerApplications;

