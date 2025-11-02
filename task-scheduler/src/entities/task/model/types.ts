export interface Task {
  id: string;
  time: string; 
  content: string;
  priority: number;
  durationMinutes: number; 
  startMinute?: number;
  completed: boolean;
  title?: string; 
  description?: string; 
  startDate?: string; 
  endDate?: string; 
  startTime?: string; 
  endTime?: string; 
  realDate?: string; 
}

export type TaskAction = 'complete' | 'edit' | 'delete'; 