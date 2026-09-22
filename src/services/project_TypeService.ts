import axios from 'axios';
import { API_URL } from "../config";

const API_URL_BASE = `${API_URL}/project-types`;

export interface ProjectType {
  id: number;
  name: string;
  description: string;
}
// formato para crear y actualizar
export interface ProjectTypeData {
  name: string;
  description: string;
}

const getToken = () => localStorage.getItem("token") || "";

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const getProjectTypes = async (): Promise<ProjectType[]> => {
  const response = await axios.get(API_URL_BASE);
  return response.data;
};

export const createProjectType = async (data: ProjectTypeData): Promise<ProjectType> => {
  const response = await axios.post(API_URL_BASE, data, getAuthHeaders());
  return response.data;
};

export const updateProjectType = async (id: number, data: ProjectTypeData): Promise<ProjectType> => {
  const response = await axios.patch(`${API_URL_BASE}/${id}`, data, getAuthHeaders());
  return response.data;
};

export const deleteProjectType = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL_BASE}/${id}`, getAuthHeaders());
};