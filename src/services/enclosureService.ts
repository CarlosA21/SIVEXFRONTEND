// src/services/enclosureService.ts
import axios from "axios";
import { API_URL } from "../config";

//const API_URL = "http://localhost:3001/academic-units";

export interface Director {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Enclosure {
  id: number;
  name: string;
  director: Director | null;
}

const getToken = () => localStorage.getItem("token") ?? "";

export const EnclosureService = {
  getAll: async (): Promise<Enclosure[]> => {
    const res = await axios.get(`${API_URL}/academic-units`);
    return res.data;
  },

  getDirectors: async (): Promise<Director[]> => {
    const res = await axios.get(`${API_URL}/academic-units/directors`);
    return res.data;
  },

  create: async (data: { name: string; directorId: number }) => {
    const token = getToken();
    return axios.post(`${API_URL}/academic-units`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  update: async (id: number, data: { name: string; directorId: number }) => {
    const token = getToken();
    return axios.patch(`${API_URL}/academic-units/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  delete: async (id: number) => {
    const token = getToken();
    return axios.delete(`${API_URL}/academic-units/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
