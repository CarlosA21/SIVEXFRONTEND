// src/components/CoordinatorProjects.tsx
import React, { useState, useEffect } from "react";
import {
  ProjectRequest,
  fetchProjectRequests,
  updateRequestStatus,
} from "../../services/ProjectRequestService";

const CoordinatorProjects: React.FC = () => {
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // 🔹 Cargar solicitudes desde el servicio
  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await fetchProjectRequests();
        setRequests(data);
      } catch (error) {
        console.error("Error cargando solicitudes:", error);
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, []);

  // 🔹 Aprobar solicitud
  const handleApprove = async (requestId: number) => {
    setActionLoading(true);
    try {
      await updateRequestStatus(requestId, "approved");
      // Actualizar estado local
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? { ...r, status: "approved", project: { ...r.project, status: "active" } }
            : r
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(false);
      setSelectedRequest(null);
    }
  };

  // 🔹 Rechazar solicitud
  const handleReject = async (requestId: number) => {
    setActionLoading(true);
    try {
      await updateRequestStatus(requestId, "rejected");
      // Actualizar estado local
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? { ...r, status: "rejected", project: { ...r.project, status: "inactive" } }
            : r
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(false);
      setSelectedRequest(null);
    }
  };

  if (loading) return <p>Cargando solicitudes...</p>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">Solicitudes de Proyectos (Coordinador)</h2>

      {/* Lista de solicitudes */}
      <div className="list-group">
        {requests.map((req) => (
          <button
            key={req.id}
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            onClick={() => setSelectedRequest(req)}
          >
            <div>
              <h5 className="mb-1">{req.project.title}</h5>
              <p className="mb-1">{req.project.description}</p>
              <small>
                Facilitador: {req.facilitator.firstName} {req.facilitator.lastName}
              </small>
            </div>
            <span
              className={`badge px-3 py-2 ${
                req.status === "approved"
                  ? "bg-success"
                  : req.status === "pending"
                  ? "bg-warning text-dark"
                  : "bg-danger"
              }`}
            >
              {req.status}
            </span>
          </button>
        ))}
      </div>

      {/* Modal de detalle */}
      {selectedRequest && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedRequest.project.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedRequest(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>{selectedRequest.project.description}</p>
                <p>
                  <strong>Facilitador:</strong>{" "}
                  {selectedRequest.facilitator.firstName}{" "}
                  {selectedRequest.facilitator.lastName}
                </p>
                <p>
                  <strong>Estado solicitud:</strong>{" "}
                  <span
                    className={`badge ${
                      selectedRequest.status === "approved"
                        ? "bg-success"
                        : selectedRequest.status === "pending"
                        ? "bg-warning text-dark"
                        : "bg-danger"
                    }`}
                  >
                    {selectedRequest.status}
                  </span>
                </p>
                <p>
                  <strong>Estado proyecto:</strong>{" "}
                  <span
                    className={`badge ${
                      selectedRequest.project.status === "active"
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                  >
                    {selectedRequest.project.status}
                  </span>
                </p>
              </div>

              <div className="modal-footer">
                {selectedRequest.status === "pending" && (
                  <>
                    <button
                      className="btn btn-success"
                      disabled={actionLoading}
                      onClick={() => handleApprove(selectedRequest.id)}
                    >
                      {actionLoading ? "Aprobando..." : "Aprobar"}
                    </button>
                    <button
                      className="btn btn-danger"
                      disabled={actionLoading}
                      onClick={() => handleReject(selectedRequest.id)}
                    >
                      {actionLoading ? "Rechazando..." : "Rechazar"}
                    </button>
                  </>
                )}
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedRequest(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordinatorProjects;