// src/services/activityServices.ts

import axios from "axios";
import { Activity } from "../models/Activity";
import { DtoNewActivity } from "../dtos/DtoNewActivity";
import { API_URL } from "../config";

// Asumimos que la URL base para actividades es diferente
//const API_URL = "http://localhost:3001/activities";

/* ============================================================
    SECCIÓN ACTIVIDADES
    ============================================================ */

/**
 * Crea una nueva actividad en el backend.
 * @param newActivity Los datos de la nueva actividad.
 * @param setLoading Función opcional para manejar el estado de carga.
 * @returns La actividad recién creada.
 */
export async function CreateActivity(
  newActivity: DtoNewActivity,
  setLoading?: (loading: boolean) => void
): Promise<Activity> {
  try {
    if (setLoading) setLoading(true);

    const token = localStorage.getItem("token");
    const response = await axios.post<Activity>(
      `${API_URL} /activities`,
      newActivity,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string })?.message ||
        "Error en la creación de la actividad.";
      throw new Error(message);
    }
    throw error;
  } finally {
    if (setLoading) setLoading(false);
  }
}


/**
 * Sube un archivo de evidencia asociado a una actividad.
 * @param file El archivo a subir.
 * @param activityId El ID de la actividad.
 */
export async function UploadEvidenceFile(
  file: File,
  activityId: number
): Promise<any> {
  const formData = new FormData();
  formData.append("file", file); // clave esperada por el backend
  formData.append("adicional", JSON.stringify({ activityId })); // clave adicional con JSON

  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      `${API_URL}/evidence/file/`,
      formData,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string })?.message ||
        "Error al subir la evidencia.";
      throw new Error(message);
    }
    throw error;
  }
}





/**
 * Obtiene todas las actividades del backend.
 * @param setLoading Función opcional para manejar el estado de carga.
 * @returns Un array de actividades.
 */
export async function GetAllActivities(
  setLoading?: (loading: boolean) => void
): Promise<Activity[]> {
  try {
    if (setLoading) setLoading(true);
    const token = localStorage.getItem("token");

    const response = await axios.get<Activity[]>(`${API_URL} /activities`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string })?.message ||
        "Error al obtener las actividades.";
      throw new Error(message);
    }
    throw error;
  } finally {
    if (setLoading) setLoading(false);
  }
}

/**
 * Obtiene una actividad específica por su ID.
 * @param id El ID de la actividad.
 * @param setLoading Función opcional para manejar el estado de carga.
 * @returns La actividad encontrada.
 */
export async function GetActivity(
  id: number,
  setLoading?: (loading: boolean) => void
): Promise<Activity> {
  try {
    if (setLoading) setLoading(true);
    const token = localStorage.getItem("token");

    const response = await axios.get<Activity>(
      `${API_URL}/activities/${id}`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Actividad no encontrada");
      }
      const message =
        (error.response?.data as { message?: string })?.message ||
        "Error al obtener la actividad.";
      throw new Error(message);
    }
    throw error;
  } finally {
    if (setLoading) setLoading(false);
  }
}

/**
 * Actualiza los datos de una actividad existente.
 * @param id El ID de la actividad a actualizar.
 * @param updateData Los datos a actualizar.
 * @param setLoading Función opcional para manejar el estado de carga.
 * @returns La actividad actualizada.
 */
export async function UpdateActivity(
  id: number,
  updateData: Partial<Activity>,
  setLoading?: (loading: boolean) => void
): Promise<Activity> {
  try {
    if (setLoading) setLoading(true);
    const token = localStorage.getItem("token");

    const response = await axios.put<Activity>(
      `${API_URL}/activities/${id}`,
      updateData,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Actividad no encontrada para actualizar");
      }
      const message =
        (error.response?.data as { message?: string })?.message ||
        "Error al actualizar la actividad.";
      throw new Error(message);
    }
    throw error;
  } finally {
    if (setLoading) setLoading(false);
  }
}

/**
 * Elimina una actividad por su ID.
 * @param id El ID de la actividad a eliminar.
 * @param setLoading Función opcional para manejar el estado de carga.
 * @returns Un mensaje de confirmación de la eliminación.
 */
export async function DeleteActivity(
  id: number,
  setLoading?: (loading: boolean) => void
): Promise<string> {
  try {
    if (setLoading) setLoading(true);
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/activities/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return response.data?.message || "Actividad eliminada correctamente";
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string })?.message ||
        "Error al eliminar la actividad.";
      throw new Error(message);
    }
    throw error;
  } finally {
    if (setLoading) setLoading(false);
  }
}