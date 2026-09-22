import axios from 'axios';

import { API_URL } from "../config";

// Interfaces para tipar los datos
interface Project {
  id: number;
  title: string;
  status: 'active' | 'inactive';
}

interface Notification {
  proyecto?: string;
  actividad?: string;
  voluntario?: string;
  fecha?: string;
  fechaVencimiento?: string;
  mensaje: string;
}

// Interfaz para la respuesta completa de la API
interface DashboardData {
  myProjects: Project[];
  notificaciones: Notification[];
}

/**
 * Obtiene los datos del dashboard para un facilitador.
 * @returns Una promesa que resuelve con los datos del dashboard.
 * @throws Si la solicitud falla, se lanza un error.
 */
export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    const response = await axios.get(
      `${API_URL}/projects/facilitator/panel`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error al cargar datos del dashboard:', error);
    throw error;
  }
};