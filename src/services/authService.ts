import axios from "axios";
//import { DtoNewUser } from "../dtos/DtoNewUser";

import { User } from "../models/User";

import { API_URL } from "../config";

import { Role } from "../models/Role"; // Se agrega la importación de Role para `GetAllRoles`.

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
}

//const API_URL = "http://localhost:3001";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>(
    `${API_URL}/auth/login`,
    payload);
  return response.data;
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const response = await axios.post<{ valid: boolean; decoded?: [] }>(
      `${API_URL}/auth/verify`,
      { token }
    );
    return response.data.valid;
  } catch {
    return false;
  }
}

export async function resetPassword(
  email: string
): Promise<{ message: string }> {
  const response = await axios.post<{ message: string }>(
    `${API_URL}/password-reset/request`,
    { email }
  );
  return response.data;
}

export async function confirmPasswordReset(
  token: string,
  newPassword: string
): Promise<{ message: string }> {
  const response = await axios.post<{ message: string }>(
    `${API_URL}/password-reset/confirm`,
    { token, newPassword }
  );
  return response.data;
}

// Funciones de gestión de usuarios añadidas
export async function GetResponsibles(): Promise<User[]> {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get<User[]>(`${API_URL}/users`, {
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

export async function updateUser(updatedUser: User): Promise<User> {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put<User>(
      `${API_URL}/users/${updatedUser.id}`,
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

export async function deleteUser(userId: number): Promise<string> {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete<string>(`${API_URL}/users/${userId}`, {
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

export async function GetAllRoles(): Promise<Role[]> {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get<Role[]>(`${API_URL}/roles`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string })?.message ||
        "Error al obtener los roles";
      throw new Error(message);
    }
    throw error;
  }
}