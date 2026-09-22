// src/services/reports.service.ts
import axios from "axios";
import { API_URL } from "../config";
// Tipos de datos
export interface ProjectSummary {
  project_title: string;
  project_id: number;
  pending_activities: number;
  in_progress_activities: number;
  completed_activities: number;
  total_volunteers: number;
}

/**
 * Obtiene el resumen de proyectos para el facilitador.
 * @returns {Promise<ProjectSummary[]>} - Un arreglo de objetos ProjectSummary.
 */
export const fetchProjectSummary = async (): Promise<ProjectSummary[]> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get<any[]>(
      `${API_URL}/projects/facilitator/summary`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Convertir todos los campos de números que podrían venir como string
    return response.data.map((p) => ({
      ...p,
      pending_activities: Number(p.pending_activities),
      in_progress_activities: Number(p.in_progress_activities),
      completed_activities: Number(p.completed_activities),
      total_volunteers: Number(p.total_volunteers),
    }));
  } catch (error) {
    console.error("Error fetching project summary:", error);
    throw new Error("Error al cargar los datos del servidor.");
  }
};