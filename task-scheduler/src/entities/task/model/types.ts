export interface Task {
  id: string;
  time: string; 
  day: number; 
  content: string;
  priority: 'low' | 'medium' | 'high';
  durationMinutes: number; 
  startMinute?: number;
  completed: boolean; 
}

export type TaskAction = 'complete' | 'edit';