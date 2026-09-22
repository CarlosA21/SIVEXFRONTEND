import axios from "axios";
import { API_URL } from "../config";


export interface Project {
  id: number;
  title: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
}

export interface EnrollmentRequest {
  id: number;
  status: string;
  createdAt: string;
  project?: Project;
  user: User;
}

const API_URL_BASE = `${API_URL}/enrollment-requests`;

// Obtener todas las solicitudes
export const fetchRequestsService = async (): Promise<EnrollmentRequest[]> => {
  const res = await axios.get<EnrollmentRequest[]>(`${API_URL_BASE}/all`);
  return res.data;
};

// Actualizar estado de una solicitud
export const updateStatusService = async (
  id: number,
  status: "approved" | "rejected"
): Promise<void> => {
  await axios.patch(
    `${API_URL_BASE}/${id}`,
    { status },
    { headers: { "Content-Type": "application/json" } }
  );
};
