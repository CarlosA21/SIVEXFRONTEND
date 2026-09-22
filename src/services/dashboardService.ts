// src/services/dashboardService.ts
import axios from "axios";
import { API_URL } from "../config";
export interface DashboardKpis {
  totalUsers: number;
  completedActivities: number;
  activeProjects: number;
  totalUnits: number;
}

const getToken = () => localStorage.getItem("token") ?? "";

export const DashboardService = {
  getKpis: async (): Promise<DashboardKpis> => {
    const token = getToken();
    if (!token) throw new Error("No se encontró el token en localStorage");

    const response = await axios.get(`${API_URL}/reports/kpis`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  },
};
