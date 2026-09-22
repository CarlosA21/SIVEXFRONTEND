// src/components/UploadDocumentForm.tsx
import React, { useState, useRef } from "react";
import { useAuth } from "../context/useAuth";
// Importamos la función que creamos en documentService
import { uploadDocument } from "../services/documentServices";
import { Icons, toast } from "react-toastify";

interface UploadDocumentFormProps {
  onUploadSuccess?: () => void;
}

const UploadDocumentForm: React.FC<UploadDocumentFormProps> = ({
  onUploadSuccess,
}) => {
  const { isAuthenticated } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Referencia para poder activar el input oculto
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validación de autenticación
    if (!isAuthenticated) {
      setErrorMsg("Debes estar autenticado para subir documentos.");
      return;
    }

    // // Validación de campos obligatorios
    // if (!identifier.trim()) {
    //   setErrorMsg("El identificador es obligatorio.");
    //   return;
    // }
    if (!title.trim()) {
      setErrorMsg("El título es obligatorio.");
      return;
    }
    if (!description.trim()) {
      setErrorMsg("La descripción es obligatoria.");
      return;
    }

    // // Validación del formato del identificador: ejemplo DOC-001
    // const identifierPattern = /^DOC-\d+$/;
    // if (!identifierPattern.test(identifier.trim())) {
    //   setErrorMsg(
    //     "El identificador debe tener el formato DOC-<número> (ej. DOC-001)."
    //   );
    //   return;
    // }

    if (!file) {
      setErrorMsg("Por favor selecciona un archivo.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await uploadDocument(
        {
          title: title.trim(),
          description: description.trim(),
        },
        file
      );

      // Verificamos que la respuesta tenga el ID del documento subido
      if (response && response.id) {
        setSuccessMsg("Documento subido correctamente.");
        toast.success("Documento subido correctamente.", {
          position: "top-center",
          icon: Icons.success,
          autoClose: 3000,
        });

        // Limpiar campos
        // setIdentifier("");
        setTitle("");
        setDescription("");
        setFile(null);

        // Notificar al padre (por ejemplo, para refrescar la lista de documentos)
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } else {
        setErrorMsg("Error al subir el documento: respuesta inesperada.");
        toast.error("Error al subir el documento.", {
          position: "top-center",
          icon: Icons.error,
          autoClose: 3000,
        });
      }
    } catch (error: unknown) {
      console.error("Error:", error);
      let errorMsgFinal = "error.message";
      if (error instanceof Error) {
        errorMsgFinal = error.message;
      }

      if (error instanceof Error && error.message.includes("Duplicate entry")) {
        errorMsgFinal = "El titulo ya existe. Por favor, usa uno diferente.";
      }
      setErrorMsg(errorMsgFinal);
      toast.error(errorMsgFinal, {
        position: "top-center",
        icon: Icons.error,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-3">
      <h4>Subir Documento</h4>
      <form onSubmit={handleSubmit}>
        {/* <div className="mb-3">
          <label className="form-label">Identificador</label>
          <input
            className="form-control"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value.toLocaleUpperCase())}
            placeholder="Ejemplo: DOC-001"
          />
        </div> */}

        <div className="mb-3">
          <label className="form-label">Título</label>
          <input
            className="form-control"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título del documento"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Breve descripción"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="customFile" className="form-label">
            Documento
          </label>
          <div className="d-flex align-items-center">
            {/* Input de archivo oculto */}
            <input
              type="file"
              id="customFile"
              onChange={handleFileChange}
              style={{ display: "none" }}
              ref={inputFileRef}
            />
            {/* Botón que actúa según si se ha seleccionado un archivo o no */}
            <button
              type={file ? "submit" : "button"}
              onClick={() => {
                if (!file) {
                  inputFileRef.current?.click();
                }
              }}
              className="btn btn-sigescal me-2"
              disabled={loading}
            >
              {file ? "Subir Documento" : "Seleccionar Documento"}
            </button>
            {/* Muestra el nombre del archivo seleccionado */}
            {file && <span>{file.name}</span>}
          </div>
        </div>

        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}
      </form>
    </div>
  );
};

export default UploadDocumentForm;
