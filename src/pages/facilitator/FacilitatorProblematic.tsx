// src/components/VolunteerProblematic.tsx
// import React, { useState, useEffect } from "react";
// import { Form, Button, Card, Spinner, Alert } from "react-bootstrap";
// import {
//   createTicket,
//   getMyTickets,
//   CreateTicketDto,
//   Ticket,
// } from "../../services/supportService";

// const FacilitatorProblematic: React.FC = () => {
//   const [formData, setFormData] = useState<CreateTicketDto>({
//     subject: "",
//     description: "",
//   });

//   const [messages, setMessages] = useState<Ticket[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [loadingTickets, setLoadingTickets] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   // 🔹 Cargar historial de tickets al montar el componente
//   useEffect(() => {
//     const fetchTickets = async () => {
//       try {
//         setLoadingTickets(true);
//         const tickets = await getMyTickets();
//         setMessages(tickets);
//       } catch (err: any) {
//         setError(err.message || "Error al cargar tus tickets.");
//       } finally {
//         setLoadingTickets(false);
//       }
//     };

//     fetchTickets();
//   }, []);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const newTicket = await createTicket(formData);
//       setMessages((prev) => [...prev, newTicket]); // agregar al historial
//       setFormData({ subject: "", description: "" });
//     } catch (error: any) {
//       alert(error.message || "Error al enviar el ticket");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h2>Tickets de Necesidad</h2>

//       {/* Historial tipo chat */}
//       <Card className="shadow-sm mb-3">
//         <Card.Header>Historial de Tickets</Card.Header>
//         <Card.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
//           {loadingTickets ? (
//             <Spinner animation="border" />
//           ) : error ? (
//             <Alert variant="danger">{error}</Alert>
//           ) : messages.length === 0 ? (
//             <p className="text-muted">No has enviado tickets todavía.</p>
//           ) : (
//             messages.map((msg) => (
//               <div key={msg.id} className="mb-3">
//                 {/* Mensaje del voluntario */}
//                 <div className="d-flex justify-content-start">
//                   <div className="p-3 rounded bg-primary text-white">
//                     <strong>{msg.subject}</strong>
//                     <p className="mb-0">{msg.description}</p>
//                   </div>
//                 </div>

//                 {/* Respuesta del facilitador */}
//                 {msg.response && (
//                   <div className="d-flex justify-content-end mt-2">
//                     <div className="p-3 rounded bg-light border">
//                       <strong>Respuesta del facilitador</strong>
//                       <p className="mb-0">{msg.response}</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))
//           )}
//         </Card.Body>
//       </Card>

//       {/* Formulario */}
//       <Card className="shadow-sm mb-4">
//         <Card.Body>
//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-3" controlId="formSubject">
//               <Form.Label>Asunto</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="subject"
//                 placeholder="Escribe el asunto de tu necesidad"
//                 value={formData.subject}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3" controlId="formDescription">
//               <Form.Label>Descripción</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={4}
//                 name="description"
//                 placeholder="Describe tu necesidad de ayuda..."
//                 value={formData.description}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>

//             <Button variant="primary" type="submit" disabled={loading}>
//               {loading ? "Enviando..." : "Enviar Ticket"}
//             </Button>
//           </Form>
//         </Card.Body>
//       </Card>
//     </div>
//   );
// };

// export default FacilitatorProblematic;

// import React, { useEffect, useState } from "react";
// import { supportService } from "../../services/supportServiceFacilitator";
// //import "../../assets/css/SupportChat.css";

// interface User {
//   firstName: string;
//   lastName: string;
// }

// interface Response {
//   id: number;
//   message: string;
//   createdAt: string;
//   responder: User;
// }

// interface Ticket {
//   id: number;
//   subject: string;
//   description: string;
//   createdAt: string;
//   participant?: User;
//   responses: Response[];
// }

// const FacilitatorProblematic: React.FC = () => {
//   const [tickets, setTickets] = useState<Ticket[]>([]);
//   const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
//   const [message, setMessage] = useState("");

//   // Formatear fecha
//   const formatDate = (dateStr: string) => {
//     const d = new Date(dateStr);
//     return d.toLocaleString("es-ES", {
//       dateStyle: "short",
//       timeStyle: "short",
//     });
//   };

//   // Cargar tickets
//   const loadTickets = async () => {
//     try {
//       const data = await supportService.getTickets();
//       setTickets(data);

//       if (selectedTicket) {
//         const updated = data.find((t: Ticket) => t.id === selectedTicket.id);
//         if (updated) setSelectedTicket(updated);
//       }
//     } catch (err) {
//       console.error("Error cargando tickets:", err);
//     }
//   };

//   useEffect(() => {
//     loadTickets();
//     const interval = setInterval(loadTickets, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   // Enviar respuesta
//   const handleSend = async () => {
//     if (!message.trim() || !selectedTicket) return;

//     try {
//       await supportService.sendResponse(selectedTicket.id, message);
//       setMessage("");
//       loadTickets();
//     } catch (err) {
//       console.error("Error enviando respuesta:", err);
//     }
//   };

//   return (
//     <div className="chat-wrapper">
//       {/* Panel izquierdo */}
//       <div className="chat-container">
//         <div className="messages">
//           {selectedTicket ? (
//             <>
//               {/* Ticket inicial */}
//               <div className="message user">
//                 <div>{selectedTicket.description}</div>
//                 <div className="meta">
//                   Ticket creado: {formatDate(selectedTicket.createdAt)}
//                 </div>
//               </div>

//               {/* Respuestas */}
//               {selectedTicket.responses.map((resp) => (
//                 <div key={resp.id} className="message support">
//                   <div>{resp.message}</div>
//                   <div className="meta">
//                     Respondido por {resp.responder.firstName}{" "}
//                     {resp.responder.lastName} el {formatDate(resp.createdAt)}
//                   </div>
//                 </div>
//               ))}
//             </>
//           ) : (
//             <p className="no-ticket">Selecciona un ticket</p>
//           )}
//         </div>
//         <div className="input-container">
//           <input
//             type="text"
//             placeholder="Escribe una respuesta..."
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyPress={(e) => e.key === "Enter" && handleSend()}
//           />
//           <button onClick={handleSend}>Enviar</button>
//         </div>
//       </div>

//       {/* Panel derecho */}
//       <div className="sidebar">
//         {tickets.map((ticket) => (
//           <div
//             key={ticket.id}
//             className={`card ${
//               !ticket.responses || ticket.responses.length === 0
//                 ? "unanswered"
//                 : ""
//             }`}
//             onClick={() => setSelectedTicket(ticket)}
//           >
//             <h4>
//               {ticket.participant
//                 ? `${ticket.participant.firstName} ${ticket.participant.lastName}`
//                 : "Anónimo"}
//             </h4>
//             <p>{ticket.subject}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FacilitatorProblematic;

import React, { useEffect, useState } from "react";
import { supportService } from "../../services/supportServiceFacilitator";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";

interface User {
  firstName: string;
  lastName: string;
}

interface Response {
  id: number;
  message: string;
  createdAt: string;
  responder: User;
}

interface Ticket {
  id: number;
  subject: string;
  description: string;
  createdAt: string;
  participant?: User;
  responses: Response[];
}

const FacilitatorProblematic: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("es-ES", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const loadTickets = async () => {
    try {
      const data = await supportService.getTickets();
      setTickets(data);

      if (selectedTicket) {
        const updated = data.find((t: Ticket) => t.id === selectedTicket.id);
        if (updated) setSelectedTicket(updated);
      }
    } catch (err) {
      console.error("Error cargando tickets:", err);
    }
  };

  useEffect(() => {
    loadTickets();
    const interval = setInterval(loadTickets, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!message.trim() || !selectedTicket) return;

    try {
      await supportService.sendResponse(selectedTicket.id, message);
      setMessage("");
      loadTickets();
    } catch (err) {
      console.error("Error enviando respuesta:", err);
    }
  };

  const openTicketModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const closeTicketModal = () => {
    setShowModal(false);
    setSelectedTicket(null);
    setMessage("");
  };

  return (
    <div className="container-fluid p-3">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0"><i className="bi bi-chat-left-dots me-2"></i>Tickets de Soporte</h5>
        </div>
        <div className="list-group list-group-flush">
          {tickets.map((ticket) => (
            <a
              key={ticket.id}
              href="#"
              className={`list-group-item list-group-item-action ${
                ticket.responses.length === 0 ? "list-group-item-danger" : ""
              }`}
              onClick={() => openTicketModal(ticket)}
            >
              <div className="d-flex w-100 justify-content-between">
                <h6 className="mb-1 text-truncate">
                  {ticket.participant ? `${ticket.participant.firstName} ${ticket.participant.lastName}` : "Anónimo"}
                </h6>
                <small className="text-muted">{formatDate(ticket.createdAt)}</small>
              </div>
              <p className="mb-1 text-truncate">{ticket.subject}</p>
              {ticket.responses.length === 0 && (
                <small className="text-danger fw-bold">Pendiente</small>
              )}
            </a>
          ))}
        </div>
      </div>

      {/* Modal para ver y responder tickets */}
      {selectedTicket && (
        <div
          className={`modal fade ${showModal ? "show d-block" : ""}`}
          tabIndex={-1}
          aria-labelledby="ticketModalLabel"
          aria-hidden={!showModal}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title" id="ticketModalLabel">
                  <i className="bi bi-person-circle me-2"></i>
                  {selectedTicket.participant ? `${selectedTicket.participant.firstName} ${selectedTicket.participant.lastName}` : "Anónimo"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  aria-label="Close"
                  onClick={closeTicketModal}
                ></button>
              </div>
              <div className="modal-body" style={{ height: "60vh", overflowY: "auto" }}>
                <div className="d-flex flex-column">
                  {/* Mensaje original del usuario */}
                  <div className="p-2 mb-2 rounded-3 text-white align-self-start" style={{ backgroundColor: '#007bff' }}>
                    <div>{selectedTicket.description}</div>
                    <div className="text-end" style={{ fontSize: '0.75rem', opacity: '0.8' }}>
                      {formatDate(selectedTicket.createdAt)}
                    </div>
                  </div>
                  {/* Respuestas */}
                  {selectedTicket.responses.map((resp) => (
                    <div
                      key={resp.id}
                      className="p-2 mb-2 rounded-3 text-dark align-self-end"
                      style={{ backgroundColor: '#f0f0f0' }}
                    >
                      <div>{resp.message}</div>
                      <div className="text-end" style={{ fontSize: '0.75rem', opacity: '0.8' }}>
                        {formatDate(resp.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer d-block">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Escribe una respuesta..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  />
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleSend}
                    disabled={!message.trim()}
                  >
                    <i className="bi bi-send-fill"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilitatorProblematic;
