// // src/components/facilitador/ParticipantesConferencistas.tsx
// import React, { useState } from "react";
// import { Table, Button, Form } from "react-bootstrap";

// interface Persona {
//   id: number;
//   nombre: string;
//   rol: "Participante" | "Conferencista";
// }

// const ParticipantsSpeakers: React.FC = () => {
//   // 🔹 Datos de prueba
//   const [personas, setPersonas] = useState<Persona[]>([
//     { id: 1, nombre: "Juan Pérez", rol: "Participante" },
//     { id: 2, nombre: "María López", rol: "Conferencista" },
//   ]);

//   const [nuevo, setNuevo] = useState<Persona>({
//     id: 0,
//     nombre: "",
//     rol: "Participante",
//   });

//   const handleAdd = () => {
//     setPersonas([...personas, { ...nuevo, id: personas.length + 1 }]);
//     setNuevo({ id: 0, nombre: "", rol: "Participante" });
//   };

//   return (
//     <div className="container mt-4">
//       <h2>👥 Participantes y Conferencistas</h2>

//       <Form className="d-flex mb-3">
//         <Form.Control
//           className="me-2"
//           type="text"
//           placeholder="Nombre"
//           value={nuevo.nombre}
//           onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
//         />
//         <Form.Select
//           className="me-2"
//           value={nuevo.rol}
//           onChange={(e) =>
//             setNuevo({ ...nuevo, rol: e.target.value as "Participante" | "Conferencista" })
//           }
//         >
//           <option value="Participante">Participante</option>
//           <option value="Conferencista">Conferencista</option>
//         </Form.Select>
//         <Button onClick={handleAdd}>Agregar</Button>
//       </Form>

//       <Table striped bordered hover>
//         <thead>
//           <tr>
//             <th>Nombre</th>
//             <th>Rol</th>
//           </tr>
//         </thead>
//         <tbody>
//           {personas.map((p) => (
//             <tr key={p.id}>
//               <td>{p.nombre}</td>
//               <td>{p.rol}</td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </div>
//   );
// };

// export default ParticipantsSpeakers;
import React, { useEffect, useState } from "react";
import {
  EnrollmentRequest,
  fetchRequestsService,
  updateStatusService,
} from "../../services/ParticipantsSpeakersService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Configurar react-toastify en el componente raíz de tu app (ej: App.tsx):
// import { ToastContainer } from "react-toastify";
// <ToastContainer position="top-right" autoClose={3000} />

const ParticipantsSpeakers: React.FC = () => {
  const [requests, setRequests] = useState<EnrollmentRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Mostrar error en modal
  const showError = (msg: string) => {
    setErrorMessage(msg);
    setShowModal(true);
    setTimeout(() => setShowModal(false), 4000);
  };

  // Cargar solicitudes
  const fetchRequests = async () => {
    try {
      const data = await fetchRequestsService();
      setRequests(data);
    } catch (err: any) {
      console.error("Error al cargar solicitudes:", err);
      showError("No se pudieron cargar las solicitudes 😢");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Aprobar o rechazar
  const updateStatus = async (id: number, status: "approved" | "rejected") => {
    try {
      await updateStatusService(id, status);
      toast.success(
        `Solicitud #${id} ${
          status === "approved" ? "aprobada ✅" : "rechazada ❌"
        }`
      );
      fetchRequests();
    } catch (err: any) {
      console.error("Error:", err);
      const msg =
        err.response?.data?.message ||
        "No se pudo actualizar la solicitud 😢";
      showError(msg);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-4">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Solicitudes de Inscripción</h1>

      {/* Modal de error */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          role="dialog"
          onClick={() => setShowModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-danger">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Error</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>{errorMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <table className="table table-striped table-bordered">
        <thead className="table-success">
          <tr>
            <th>ID</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Proyecto</th>
            <th>Voluntario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td>{req.id}</td>
              <td>{req.status}</td>
              <td>{new Date(req.createdAt).toLocaleString()}</td>
              <td>{req.project ? req.project.title : "Sin proyecto"}</td>
              <td>
                {req.user.firstName} {req.user.lastName}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-success me-2"
                  onClick={() => updateStatus(req.id, "approved")}
                  disabled={req.status !== "pending"}
                >
                  Aprobar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => updateStatus(req.id, "rejected")}
                  disabled={req.status !== "pending"}
                >
                  Rechazar
                </button>
              </td>
            </tr>
          ))}
          {requests.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center">
                No hay solicitudes pendientes
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipantsSpeakers;


