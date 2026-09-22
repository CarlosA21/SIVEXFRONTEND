export interface DtoNewActivity {
  name: string;
  description: string;
  date: string;
  status: string; // Se recomienda usar 'pending' | 'in_progress' | 'completed' | 'cancelled';
  projectId: number;
}