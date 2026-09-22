// src/services/ProjectRequestService.ts
import axios from "axios";
import { API_URL } from "../config";

// Interfaces ajustadas al JSON de project-requests
export interface Facilitator {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string | null;
  status: "active" | "inactive";
}

export interface ProjectRequest {
  id: number; // id de la solicitud
  status: "approved" | "pending" | "rejected";
  comments: string;
  createdAt: string;
  project: Project;
  facilitator: Facilitator;
}

const API_URL_BASE = `${API_URL}/project-requests`;

/**
 * Obtiene todas las solicitudes de proyectos.
 * @returns {Promise<ProjectRequest[]>} Una promesa que resuelve con un array de solicitudes.
 */
export async function fetchProjectRequests(): Promise<ProjectRequest[]> {
  const token = localStorage.getItem("token");
  const response = await axios.get<ProjectRequest[]>(API_URL_BASE, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return response.data;
}

/**
 * Actualiza el estado de una solicitud de proyecto específica.
 * @param {number} requestId - El ID de la solicitud a actualizar.
 * @param {"approved" | "rejected"} newStatus - El nuevo estado de la solicitud.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la actualización es exitosa.
 */
export async function updateRequestStatus(
  requestId: number,
  newStatus: "approved" | "rejected"
): Promise<void> {
  const token = localStorage.getItem("token");
  await axios.patch(
    `${API_URL_BASE}/${requestId}`,
    { status: newStatus },
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    }
  );
}