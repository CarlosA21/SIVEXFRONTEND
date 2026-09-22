export interface DtoNewProject {
  title: string;
  description: string;
  startDate: string;
  endDate: string | null;
  status: "inactive" | "completed" | "active"; // Se recomienda usar 'active' | 'completed' | 'on_hold' | 'cancelled';
  projectType: "extensionism" | "volunteering"; // Se recomienda usar 'volunteering' | 'research' | 'development';
}