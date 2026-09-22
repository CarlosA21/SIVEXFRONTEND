// src/services/reportService.ts
import axios from "axios";
import { API_URL } from "../config";

const API_URL_BASE = `${API_URL}/reports`;

// Tipos usados en el frontend
export interface KPIs {
  totalUsuarios: number;
  totalProyectos: number;
  totalUnidades: number;
  actividadesCompletadas: number;
}

export interface UserByUnit {
  unidad: string;
  totalUsuarios: number;
}

export interface ProjectByUnit {
  unidad: string;
  totalProyectos: number;
}

export interface ActivitiesStatus {
  completadas: number;
  pendientes: number;
  enCurso: number;
}

export interface EnrollmentsMonthly {
  labels: string[];
  values: number[];
}

class ReportService {
  // === KPIs ===
  async getKPIs(): Promise<KPIs> {
    const { data } = await axios.get(`${API_URL_BASE}/kpis`);
    return {
      totalUsuarios: data.totalUsers,
      totalProyectos: data.activeProjects,
      totalUnidades: data.totalUnits,
      actividadesCompletadas: data.completedActivities,
    };
  }

  // === Usuarios por unidad ===
  async getUsersByUnit(unit: string = "all"): Promise<UserByUnit[]> {
    const { data } = await axios.get(`${API_URL_BASE}/users-by-unit`, {
      params: { unit },
    });
    return data.map((u: any) => ({
      unidad: u.unit ?? "Sin asignar",
      totalUsuarios: Number(u.total),
    }));
  }

  // === Proyectos por unidad ===
  async getProjectsByUnit(unit: string = "all"): Promise<ProjectByUnit[]> {
    const { data } = await axios.get(`${API_URL_BASE}/projects-by-unit`, {
      params: { unit },
    });
    return data.map((p: any) => ({
      unidad: p.unit ?? "Sin asignar",
      totalProyectos: Number(p.total),
    }));
  }

  // === Estado de actividades ===
  async getActivitiesStatus(projectId?: number): Promise<ActivitiesStatus> {
    const { data } = await axios.get(`${API_URL_BASE}/activities-status`, {
      params: projectId ? { projectId } : {},
    });

    let result: ActivitiesStatus = { completadas: 0, pendientes: 0, enCurso: 0 };

    data.forEach((a: any) => {
      if (a.status === "completed") result.completadas = Number(a.total);
      if (a.status === "pending") result.pendientes = Number(a.total);
      if (a.status === "in_progress") result.enCurso = Number(a.total);
    });

    return result;
  }

  // === Inscripciones mensuales ===
  async getEnrollmentsMonthly(year: number = new Date().getFullYear()): Promise<EnrollmentsMonthly> {
    const { data } = await axios.get(`${API_URL_BASE}/inscriptions-by-month`, {
      params: { year },
    });

    const labels = data.map((d: any) => `Mes ${d.month}`);
    const values = data.map((d: any) => Number(d.total));

    return { labels, values };
  }

  // === Usuarios detalle ===
  async getUsersDetail() {
    const { data } = await axios.get(`${API_URL_BASE}/users-detail`);
    return data;
  }

  // === Proyectos detalle ===
  async getProjectsDetail() {
    const { data } = await axios.get(`${API_URL_BASE}/projects-detail`);
    return data;
  }
}

export default new ReportService();