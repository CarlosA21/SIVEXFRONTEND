// src/services/project_Service.ts
import axios from "axios";
import { Project, Activity } from "../models/Project";
import { API_URL } from "../config";

/**
 * Maneja los errores de Axios y devuelve un mensaje claro.
 */
function handleAxiosError(error: unknown, defaultMessage: string): never {
  if (axios.isAxiosError(error)) {
    const message =
      (error.response?.data as { message?: string })?.message ??
      error.message ??
      defaultMessage;
    throw new Error(message);
  }
  throw error;
}

/**
 * Obtiene el token de autenticación desde localStorage.
 */
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

/**
 * Wrapper para manejar loading states.
 */
const withLoading = async <T,>(
  setLoading: ((loading: boolean) => void) | undefined,
  apiCall: () => Promise<T>
): Promise<T> => {
  if (setLoading) setLoading(true);
  try {
    return await apiCall();
  } finally {
    if (setLoading) setLoading(false);
  }
};

/**
 * ========================
 * PROYECTOS
 * ========================
 */

/**
 * Obtiene todos los proyectos con paginación.
 */
export async function GetAllProjects(
  setLoading?: (loading: boolean) => void,
  page: number = 1,
  limit: number = 5
): Promise<{ data: Project[]; total: number; page: number; lastPage: number }> {
  return withLoading(setLoading, async () => {
    try {
      const { data } = await axios.get<{
        data: Project[];
        total: number;
        page: number;
        lastPage: number;
      }>(`${API_URL}/projects?page=${page}&limit=${limit}`, {
        headers: getAuthHeaders(),
      });
      return data;
    } catch (error) {
      handleAxiosError(error, "Error al obtener los proyectos.");
    }
  });
}

/**
 * Crea un nuevo proyecto.
 */
export async function CreateProject(
  newProject: Partial<Project>,
  setLoading?: (loading: boolean) => void
): Promise<Project> {
  return withLoading(setLoading, async () => {
    try {
      const { data } = await axios.post<Project>(
        `${API_URL}/projects`,
        newProject,
        { headers: getAuthHeaders() }
      );
      return data;
    } catch (error) {
      handleAxiosError(error, "Error en la creación del proyecto.");
    }
  });
}

/**
 * Actualiza un proyecto existente.
 */
export async function UpdateProject(
  id: number,
  project: Partial<Project>,
  setLoading?: (loading: boolean) => void
): Promise<Project> {
  return withLoading(setLoading, async () => {
    try {
      const { data } = await axios.patch<Project>(
        `${API_URL}/projects/${id}`,
        project,
        { headers: getAuthHeaders() }
      );
      return data;
    } catch (error) {
      handleAxiosError(error, "Error en la actualización del proyecto.");
    }
  });
}

/**
 * Envía una solicitud de aprobación para un proyecto.
 */
export async function SendApprovalRequest(
  projectId: number,
  setLoading?: (loading: boolean) => void
): Promise<any> {
  return withLoading(setLoading, async () => {
    try {
      const { data } = await axios.post(
        `${API_URL}/project-requests`,
        { projectId },
        { headers: getAuthHeaders() }
      );
      return data;
    } catch (error) {
      handleAxiosError(error, "Error al enviar la solicitud de aprobación.");
    }
  });
}

/**
 * Obtiene los responsables de un proyecto.
 */
export async function GetProjectResponsables(
  projectId: number,
  setLoading?: (loading: boolean) => void
): Promise<any> {
  return withLoading(setLoading, async () => {
    try {
      const { data } = await axios.post(
        `${API_URL}/projects/responsables`,
        { projectId },
        { headers: getAuthHeaders() }
      );
      return data;
    } catch (error) {
      handleAxiosError(error, "Error al obtener los responsables del proyecto.");
    }
  });
}

/**
 * ========================
 * ACTIVIDADES
 * ========================
 */

/**
 * Crea una nueva actividad.
 */
export async function CreateActivity(
  activity: Partial<Activity>,
  setLoading?: (loading: boolean) => void
): Promise<Activity> {
  return withLoading(setLoading, async () => {
    try {
      const { data } = await axios.post<Activity>(
        `${API_URL}/activities`,
        activity,
        { headers: getAuthHeaders() }
      );
      return data;
    } catch (error) {
      handleAxiosError(error, "Error en la creación de la actividad.");
    }
  });
}

/**
 * Actualiza una actividad.
 */
export async function UpdateActivity(
  id: number,
  activity: Partial<Activity>,
  setLoading?: (loading: boolean) => void
): Promise<Activity> {
  return withLoading(setLoading, async () => {
    try {
      const { data } = await axios.put<Activity>(
        `${API_URL}/activities/${id}`,
        activity,
        { headers: getAuthHeaders() }
      );
      return data;
    } catch (error) {
      handleAxiosError(error, "Error en la actualización de la actividad.");
    }
  });
}

/**
 * Elimina una actividad.
 */
export async function DeleteActivity(id: number): Promise<void> {
  try {
    await axios.delete(`${API_URL}/activities/${id}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    handleAxiosError(error, "Error al eliminar la actividad.");
  }
}

/**
 * ========================
 * UNIDADES ACADÉMICAS
 * ========================
 */

/**
 * Obtiene todas las unidades académicas.
 */
export async function GetAcademicUnits(): Promise<any[]> {
  try {
    const { data } = await axios.get(`${API_URL}/academic-units`, {
      headers: getAuthHeaders(),
    });
    return data;
  } catch (error) {
    handleAxiosError(error, "Error al obtener las unidades académicas.");
  }
}

