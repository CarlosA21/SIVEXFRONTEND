import React, { useState, useEffect } from "react";
import { Form, Button, Card, Spinner, Alert } from "react-bootstrap";
import {
  createTicket,
  getMyTickets,
  CreateTicketDto,
  Ticket,
} from "../../services/supportService";

const VolunteerProblematic: React.FC = () => {
  const [formData, setFormData] = useState<CreateTicketDto>({
    subject: "",
    description: "",
  });

  const [messages, setMessages] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTickets, setLoadingTickets] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Cargar historial de tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoadingTickets(true);
        const tickets = await getMyTickets();
        setMessages(tickets);
      } catch (err: any) {
        setError(err.message || "Error al cargar tus tickets.");
      } finally {
        setLoadingTickets(false);
      }
    };

    fetchTickets();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newTicket = await createTicket(formData);
      setMessages((prev) => [...prev, newTicket]);
      setFormData({ subject: "", description: "" });
    } catch (error: any) {
      alert(error.message || "Error al enviar el ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Tickets de Necesidad</h2>

      {/* Historial tipo chat */}
      <Card className="shadow-sm mb-3">
        <Card.Header>Historial de Tickets</Card.Header>

        <Card.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
          {loadingTickets ? (
            <Spinner animation="border" />
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : messages.length === 0 ? (
            <p className="text-muted">No has enviado tickets todavía.</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="mb-4">
                {/* Ticket del voluntario */}
                <div className="d-flex justify-content-start">
                  <div
                    className="p-3 rounded text-white"
                    style={{
                      backgroundColor: "#0a1931", // azul oscuro
                      maxWidth: "70%",
                    }}
                  >
                    <strong>{msg.subject}</strong>
                    <p className="mb-0">{msg.description}</p>
                    <div
                      style={{
                        fontSize: "11px",
                        marginTop: "4px",
                        color: "#e0e0e0",
                      }}
                    >
                      {new Date(msg.createdAt).toLocaleString("es-ES")}
                    </div>
                  </div>
                </div>

                {/* Respuestas del facilitador */}
                {msg.responses &&
                  msg.responses.map((resp) => (
                    <div key={resp.id} className="d-flex justify-content-end mt-2">
                      <div
                        className="p-3 rounded text-white"
                        style={{
                          backgroundColor: "#ff6600", // naranja
                          maxWidth: "70%",
                        }}
                      >
                        <strong>
                          {resp.responder
                            ? `${resp.responder.firstName} ${resp.responder.lastName}`
                            : "Facilitador"}
                        </strong>
                        <p className="mb-0">{resp.message}</p>
                        <div
                          style={{
                            fontSize: "11px",
                            marginTop: "4px",
                            color: "#fbe9e7",
                          }}
                        >
                          {new Date(resp.createdAt).toLocaleString("es-ES")}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ))
          )}
        </Card.Body>
      </Card>

      {/* Formulario */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formSubject">
              <Form.Label>Asunto</Form.Label>
              <Form.Control
                type="text"
                name="subject"
                placeholder="Escribe el asunto de tu necesidad"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                placeholder="Describe tu necesidad de ayuda..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar Ticket"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default VolunteerProblematic;
