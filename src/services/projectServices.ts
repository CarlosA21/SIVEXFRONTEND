// src/services/projectServices.ts

import axios from "axios";
import { Project, Activity } from "../models/Project";
import { DtoNewProject } from "../dtos/DtoNewProject";
import { DtoNewActivity } from "../dtos/DtoNewActivity";
import { API_URL } from "../config";


// Asumimos que la URL base para proyectos es diferente
const BASE_URL = `${API_URL}/projects/all`;
const BASE_URL_UPDATE_ACTIVITY = `${API_URL}/activities`;
const BASE_URL_PROJECTS = `${API_URL}/projects`;

/* ============================================================
    SECCIÓN PROYECTOS
    ============================================================ */

/**
 * Crea un nuevo proyecto en el backend.
 * @param newProject Los datos del nuevo proyecto.
 * @param setLoading Función opcional para manejar el estado de carga.
 * @returns El proyecto recién creado.
 */
export async function CreateProject(
  newProject: DtoNewProject,
  setLoading?: (loading: boolean) => void
): Promise<Project> {
  try {
    if (setLoading) setLoading(true);

    const token = localStorage.getItem("token");

    const response = await axios.post<Project>(BASE_URL, newProject, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string })?.message ??
        error.message ??
        "Error en la creación del proyecto.";
      throw new Error(message);
    }
    throw error;
  } finally {
    if (setLoading) setLoading(false);
  }
}



/**
 * Obtiene un proyecto específico POR SU ID, incluyendo sus actividades.
 * Esta función está adaptada para la respuesta de tu API.
 * @param id El ID del proyecto.
 * @returns El proyecto encontrado con sus actividades.
 */
export async function GetProjectById_v2(id: string): Promise<Project> {
  try {
    const token = localStorage.getItem("token");

    // La URL de tu API para obtener un proyecto específico
    const response = await axios.get<Project>(
      `${BASE_URL_PROJECTS}/${id}`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    // Tu API ya devuelve las actividades dentro del objeto del proyecto.
    // El tipo 'Project' en models/Project.ts debe tener una propiedad 'activities: Activity[]'.
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Proyecto no encontrado");
      }
      const message =
        (error.response?.data as { message?: string })?.message ||
        "Error al obtener el proyecto.";
      throw new Error(message);
    }
    throw error;
  }
}

/**
 * Obtiene todos los proyectos del backend.
 * @param setLoading Función opcional para manejar el estado de carga.
 * @returns Un array de proyectos.
 */
export async function GetAllProjects(
  setLoading?: (loading: boolean) => void
): Promise<Project[]> {
  try {
    if (setLoading) setLoading(true);
    const token = localStorage.getItem("token");

    const response = await axios.get<Project[]>(BASE_URL, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string })?.message ||
        "Error al obtener los proyectos.";
      throw new Error(message);
    }
    throw error;
  } finally {
    if (setLoading) setLoading(false);
  }
}



// Obtiene todos los proyectos en los que el usuario está inscrito.
// @returns Un array de proyectos.
export async function GetUserEnrollmentsProjects(): Promise<Project[]> {

  const BASE_URLl = `${API_URL}/projects`;
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get<Project[]>(
      `${BASE_URLl}/enrollment_project/user`,
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
        "Error al obtener los proyectos del usuario.";
      throw new Error(message);
    }
    throw error;
  }
}



/**
 * Obtiene todas las solicitudes de inscripción de un usuario.
 * @param userId El ID del usuario.
 * @param setLoading Función opcional para manejar el estado de carga.
 */
export async function GetVolunteerApplications(
  setLoading?: (loading: boolean) => void
): Promise<any[]> {
  try {
    if (setLoading) setLoading(true);

    const token = localStorage.getItem("token");

    const response = await axios.get<any[]>(
      `${API_URL}/enrollment-requests/all_enrollmet_user`,
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
        "Error al obtener las solicitudes del voluntario.";
      throw new Error(message);
    }
    throw error;
  } finally {
    if (setLoading) setLoading(false);
  }
}





/**
 * Obtiene un proyecto específico por su ID.
 * @param id El ID del proyecto.
 * @param setLoading Función opcional para manejar el estado de carga.
 * @returns El proyecto encontrado.
 */
export async function GetProject(
  id: number,
  setLoading?: (loading: boolean) => void
): Promise<Project> {
  try {
    if (setLoading) setLoading(true);
    const token = localStorage.getItem("token");

    const response = await axios.get<Project>(
      `${BASE_URL}/${id}`,
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
        throw new Error("Proyecto no encontrado");
      }
      const message =
        (error.response?.data as { message?: string })?.message ||
        "Error al obtener el proyecto.";
      throw new Error(message);
    }
    throw error;
  } finally {
    if (setLoading) setLoading(false);
  }
}

/**
 * Actualiza los datos de un proyecto existente.
 * @param id El ID del proyecto a actualizar.
 * @param updateData Los datos a actualizar del proyecto.
 * @param setLoading Función opcional para manejar el estado de carga.
 * @returns El proyecto actualizado.
 */
export async function UpdateProject(
  id: number,
  updateData: Partial<Project>,
  setLoading?: (loading: boolean) => void
): Promise<Project> {
  try {
    if (setLoading) setLoading(true);
    const token = localStorage.getItem("token");
    console.log("Id del proyecto  "+id);
    console.log("Payload enviado a backend:", JSON.stringify(updateData, null, 2));

    const response = await axios.patch<Project>(
      `${BASE_URL}/${id}`,
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
        throw new Error("Proyecto no encontrado para actualizar");
      }
      const message =
        (error.response?.data as { message?: string })?.message ||
        "Error al actualizar el proyecto.";
      throw new Error(message);
    }
    throw error;
  } finally {
    if (setLoading) setLoading(false);
  }
}

/**
 * Envía una solicitud de inscripción a un proyecto.
 * @param projectId ID del proyecto al cual el usuario desea unirse.
 * @param setLoading Función opcional para manejar el estado de carga.
 * @returns Un mensaje de confirmación o el objeto devuelto por el backend.
 */
export async function RequestEnrollment(
  projectId: number,
  setLoading?: (loading: boolean) => void
): Promise<any> {
  try {
    if (setLoading) setLoading(true);

    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}/enrollment-requests`,
      { projectId },
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string })?.message ||
        "Error al enviar la solicitud de inscripción.";
      throw new Error(message);
    }
    throw error;
  } finally {
    if (setLoading) setLoading(false);
  }
}



/**
 * Elimina un proyecto por su ID.
 * @param id El ID del proyecto a eliminar.
 * @param setLoading Función opcional para manejar el estado de carga.
 * @returns Un mensaje de confirmación de la eliminación.
 */
export async function DeleteProject(
  id: number,
  setLoading?: (loading: boolean) => void
): Promise<string> {
  try {
    if (setLoading) setLoading(true);
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return response.data?.message || "Proyecto eliminado correctamente";
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string })?.message ||
        "Error al eliminar el proyecto.";
      throw new Error(message);
    }
    throw error;
  } finally {
    if (setLoading) setLoading(false);
  }
}




// Interfaces
export interface ProjectType {
  id: number;
  name: string;
  description: string;
}


export interface AcademicUnit {
  id: number;
  name: string;
}


// export interface Activity {
//   id: number;
//   name: string;
//   description: string;
//   date: string;
//   status: "pending" | "in_progress" | "completed";
//   projectId?: number;
// }



export interface User {
  id: number;
  name: string;
  role: "Facilitator" | "Student" | "Admin";
}

// export interface Project {
//   id: number;
//   title: string;
//   description: string;
//   startDate: string;
//   endDate: string | null;
//   status: "active" | "pending" | "completed";
//   projectType: ProjectType;      // objeto completo
//   activities: Activity[];
//   academicUnits: AcademicUnit[]; // array de objetos
// }


// API URLs
const API_PROJECTS = `${API_URL}/projects`;
const API_ACTIVITIES = `${API_URL}/activities`;

// 📌 Obtener todos los proyectos
export const getProjects = async (): Promise<Project[]> => {
  const res = await axios.get<Project[]>(API_PROJECTS);
  return res.data;
};

// 📌 Crear una nueva actividad
export const createActivity = async (activity: Omit<Activity, "id">) => {
  const res = await axios.post(API_ACTIVITIES, activity);
  return res.data;
};


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
      `${API_URL}/activities/`,
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

    const response = await axios.get<Activity[]>(BASE_URL, {
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
      `${BASE_URL}/${id}`,
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
      `${BASE_URL_UPDATE_ACTIVITY}/${id}`,
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
    const response = await axios.delete(`${BASE_URL_UPDATE_ACTIVITY}/${id}`, {
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