// src/models/Project.ts

// ========================
// Academic Units
// ========================
export interface AcademicUnit {
  id: number;
  name: string;
}

// ========================
// Project Types
// ========================
export interface ProjectType {
  id: number;
  name: "extensionism" | "volunteering"; // 👈 restringido a lo que espera backend
  description: string;
}

// ========================
// Activities
// ========================
export interface Activity {
  id: number;
  name: string; // 👈 asegúrate de usar siempre "name"
  description: string;
  date: string;
  status: "pending" | "in_progress" | "completed";
  projectId?: number;
}

// ========================
// Project (lo que devuelve el backend)
// ========================
export interface Project {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string | null;
  status: "active" | "inactive" | "completed";
  projectType: "extensionism" | "volunteering"; // 👈 string simple en backend
  activities: Activity[];
  academicUnits: AcademicUnit[];
}

// ========================
// ProjectInput (para formularios en frontend)
// ========================
// Aquí permitimos que `projectType` sea string o ProjectType completo
export type ProjectTypeInput = "extensionism" | "volunteering" | ProjectType;

export interface ProjectInput extends Omit<Project, "projectType"> {
  projectType?: ProjectTypeInput;
}
