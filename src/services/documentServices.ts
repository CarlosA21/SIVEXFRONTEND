import axios from "axios";

import { newDocumentDto, DocumentFile } from "../dtos/DocumentDto";

const BASE_URL = "http://localhost:3001/documents";

export async function uploadDocument(
  documentData: Omit<newDocumentDto, "id">,
  file: File
): Promise<newDocumentDto> {
  try {
    const token = localStorage.getItem("token") || "";

    // Creamos formData con los campos y el archivo
    const formData = new FormData();
    formData.append("title", documentData.title);
    formData.append("description", documentData.description);
    formData.append("file", file);

    const response = await axios.post<newDocumentDto>(
      `${BASE_URL}/file`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // No es necesario establecer manualmente 'Content-Type'
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      let message =
        (error.response?.data as { message?: string })?.message ||
        "Error al subir el documento";
      // Si el error es de identificador duplicado, se adapta el mensaje.
      if (message.includes("Duplicate entry")) {
        message = "El identificador ya existe. Por favor, usa uno diferente.";
      }
      throw new Error(message);
    }
    throw error;
  }
}

export async function getAllDocuments(): Promise<DocumentFile[]> {
  try {
    const token = localStorage.getItem("token") || "";

    const response = await axios.get<DocumentFile[]>(`${BASE_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string })?.message ||
        "Error al obtener documentos";
      throw new Error(message);
    }
    throw error;
  }
}

export async function getDocumentById(id: number): Promise<DocumentFile> {
  try {
    const token = localStorage.getItem("token") || "";

    const response = await axios.get<DocumentFile>(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Documento no encontrado");
      }
      const message =
        (error.response?.data as { message?: string })?.message ||
        "Error al obtener el documento";
      throw new Error(message);
    }
    throw error;
  }
}

export async function updateDocument(
  id: number,
  updatedData: Partial<newDocumentDto>,
  file?: File
): Promise<newDocumentDto> {
  try {
    const token = localStorage.getItem("token") || "";

    // Si tu backend maneja archivo en PATCH, usarías FileInterceptor.
    // Aquí un ejemplo con formData (igual que en upload).
    let payload: FormData | Partial<newDocumentDto>;
    let config = {};

    if (file) {
      const formData = new FormData();
      // if (updatedData.identifier)
      //   formData.append("identifier", updatedData.identifier);
      if (updatedData.title) formData.append("title", updatedData.title);
      if (updatedData.description)
        formData.append("description", updatedData.description);
      formData.append("file", file);

      payload = formData;
      config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    } else {
      // Si no hay archivo, mandamos JSON
      payload = updatedData;
      config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    }

    const response = await axios.patch<newDocumentDto>(
      `${BASE_URL}/${id}`,
      payload,
      config
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string })?.message ||
        "Error al actualizar el documento";
      throw new Error(message);
    }
    throw error;
  }
}

export async function deleteDocument(
  id: number
): Promise<{ success: boolean }> {
  try {
    const token = localStorage.getItem("token") || "";

    const response = await axios.delete<{ success: boolean }>(
      `${BASE_URL}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string })?.message ||
        "Error al eliminar el documento";
      throw new Error(message);
    }
    throw error;
  }
}

export async function downloadDocument(id: number): Promise<Blob> {
  try {
    const token = localStorage.getItem("token") || "";

    const response = await axios.get(`${BASE_URL}/download/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob", // para recibir un Blob (archivo)
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Documento no encontrado");
      }
      const message =
        (error.response?.data as { message?: string })?.message ||
        "Error al descargar el documento";
      throw new Error(message);
    }
    throw error;
  }
}
