// src/services/authService.ts
import axios from "axios";
import { DtoNewUser } from "../dtos/DtoNewUser";
import { User, UpdatedUser } from "../models/User";

import { API_URL } from "../config";

const BASE_URL = `${API_URL}/users`;

export async function register(newUser: DtoNewUser): Promise<User> {
  try {
    const response = await axios.post<User>(`${BASE_URL}/register`, newUser);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Usuario no encontrado");
      }

      const message =
        (error.response?.data as { message?: string })?.message ||
        "Error en el registro";

      if (message.toLowerCase().includes("email")) {
        throw new Error("El correo ya existe");
      }

      throw new Error(message);
    }
    throw error;
  }
}

export async function GetResponsibles(): Promise<User[]> {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get<User[]>(`${BASE_URL}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Usuarios no encontrados");
      }
      const message =
        (error.response?.data as { message?: string })?.message ||
        "Error al obtener los usuarios";
      throw new Error(message);
    }
    throw error;
  }
}

export async function getUserByEmail(email: string): Promise<User> {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get<User>(`${BASE_URL}/by-email/${email}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Usuario no encontrado");
      }
      const message =
        (error.response?.data as { message?: string })?.message ||
        "Error al obtener el usuario";
      throw new Error(message);
    }
    throw error;
  }
}

// ✅ Función corregida para usar el tipo UpdatedUser
export async function updateUser(updatedUser: UpdatedUser): Promise<User> {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put<User>(
      `${BASE_URL}/${updatedUser.id}`, // Usa el ID para la URL
      updatedUser,
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
        "Error al actualizar usuario";
      throw new Error(message);
    }
    throw error;
  }
}

/**
 * @description Elimina un usuario por su ID.
 * @param {number} userId - El ID del usuario a eliminar.
 * @returns {Promise<string>} Mensaje de éxito o error.
 */
export async function deleteUser(userId: number): Promise<string> {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete<string>(`${BASE_URL}/${userId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string })?.message ||
        "Error al eliminar usuario";
      throw new Error(message);
    }
    throw error;
  }
}