import axios from "axios";
import { API_URL } from "../config";
export const API_PROJECTS = `${API_URL}/projects`;
export const API_USERS = `${API_URL}/users`;
export const API_ASSIGN_COORDINATOR = `${API_URL}/projects/assign-coordinator`;
export const API_ASSIGN_FACILITATOR = `${API_URL}/projects/assign-facilitator`;

// Tipos
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  role: { name: string };
}

export interface Project {
  id: number;
  title: string;
  description: string;
}

// Cargar usuarios
export const getUsers = async (): Promise<User[]> => {
  const { data } = await axios.get<{ data: User[] }>(`${API_USERS}?limit=1000`);
  return data.data; // 🔹 aquí va .data porque el backend devuelve { data, total, ... }
};

// Cargar proyectos
export const getProjects = async (): Promise<Project[]> => {
  const { data } = await axios.get<Project[]>(`${API_PROJECTS}/all`);
  return data;
};

// Asignar coordinador o facilitador
export const assignUserToProject = async (
  projectId: number,
  userId: number,
  role: "coordinator" | "facilitator"
) => {
  const url = role === "coordinator" ? API_ASSIGN_COORDINATOR : API_ASSIGN_FACILITATOR;
  return axios.post(url, { projectId, userId });
};
