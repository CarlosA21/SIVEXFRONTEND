// src/services/DashboardService.ts
import axios from "axios";
import { API_URL } from "../config";

//const API_URL = "http://localhost:3001/reports/kpis";

export interface KpiData {
  totalUsers: number;
  completedActivities: number;
  activeProjects: number;
  totalUnits: number;
}

/**
 * Fetches key performance indicator (KPI) data from the API.
 * @returns A promise that resolves to an object containing KPI data.
 * @throws An error if the token is not found or the API request fails.
 */
export const fetchKpis = async (): Promise<KpiData> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No se encontró el token en localStorage");
  }

  try {
    const response = await axios.get(`${API_URL}/reports/kpis`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    // Return a more descriptive error if available
    throw new Error(error.response?.data?.message || "Error al cargar KPIs");
  }
};