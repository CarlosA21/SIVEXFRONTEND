// src/components/UploadEvidence.tsx
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Form, Button, Alert, Spinner, Card } from "react-bootstrap";
import { UploadEvidenceFile } from "../../services/activityServices";

interface UploadEvidenceProps {
  activityId: number;
}

const UploadEvidence: React.FC<UploadEvidenceProps> = ({ activityId }) => {
    console.log(activityId);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      setError("Por favor, selecciona un archivo para subir.");
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await UploadEvidenceFile(file, activityId);
      setMessage("Evidencia subida exitosamente.");
      console.log("Respuesta del servidor:", response);
      setFile(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-3">
      <Card.Header>
        <h5 className="mb-0">Subir Evidencia</h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Selecciona un archivo (PDF, JPG, PNG)</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
              disabled={loading}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={loading || !file}>
            {loading ? <Spinner animation="border" size="sm" /> : "Subir"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default UploadEvidence;

