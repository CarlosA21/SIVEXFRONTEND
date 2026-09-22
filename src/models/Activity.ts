export interface Activity {
  id: number;
  name: string;
  description: string;
  date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  projectId: number;
}
