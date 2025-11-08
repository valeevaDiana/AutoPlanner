export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: number; // 1–10
  startDate?: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endDate?: string;
  endTime?: string;
  durationMinutes: number;
  isRepeating?: boolean;
  repeatCount?: number;
  startDateTimeRepit?: string;
  endDateTimeRepit?: string;
  completed: boolean;
  realDate: string;
}

export type TaskAction = 'complete' | 'edit' | 'delete'; 