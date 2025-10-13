export interface Task {
  id: string;
  time: string; 
  day: number; 
  content: string;
  priority: 'low' | 'medium' | 'high';
  durationMinutes: number; 
  startMinute?: number;
  completed: boolean;
  title?: string; 
  description?: string; 
  startDate?: string; 
  endDate?: string; 
  startTime?: string; 
  endTime?: string; 
}

export type TaskAction = 'complete' | 'edit';
