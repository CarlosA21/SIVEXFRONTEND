// src/services/supportService.ts
import axios from "axios";
import { API_URL } from "../config";

const BASE_URL = `${API_URL}/support`;

export interface CreateTicketDto {
  subject: string;
  description: string;
}

export interface ResponseDto {
  id: number;
  message: string;
  createdAt: string;
  responder?: {
    firstName: string;
    lastName: string;
  };
}

export interface Ticket {
  id: number;
  subject: string;
  description: string;
  createdAt: string;
  responses: ResponseDto[];
}

/**
 * Crear un nuevo ticket
 */
export async function createTicket(
  ticketData: CreateTicketDto
): Promise<Ticket> {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post<Ticket>(
      `${BASE_URL}/ticket`,
      ticketData,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string })?.message ||
        "Error al crear el ticket";
      throw new Error(message);
    }
    throw error;
  }
}

/**
 * Obtener todos los tickets creados por el usuario autenticado
 */
export async function getMyTickets(): Promise<Ticket[]> {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get<Ticket[]>(`${BASE_URL}/ticket/my`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string })?.message ||
        "Error al obtener tus tickets";
      throw new Error(message);
    }
    throw error;
  }
}
