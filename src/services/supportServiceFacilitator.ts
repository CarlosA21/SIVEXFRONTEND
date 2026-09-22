import axios from "axios";
import { API_URL } from "../config";


const API_BASE = `${API_URL}/support`;

// Configurar instancia de Axios
const api = axios.create({
  baseURL: API_BASE,
});

// Interceptor para agregar el token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Guarda el token en localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const supportService = {
  getTickets: async () => {
    const { data } = await api.get("/tickets");
    return data;
  },
  sendResponse: async (idTicket: number, message: string) => {
    const { data } = await api.post("/ticket/respond", { idTicket, message });
    return data;
  },
};
