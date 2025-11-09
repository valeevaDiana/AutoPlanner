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
  repeateDurationMinute: number;
  ruleOneTask?: boolean;
  startDateTimeRuleOneTask?: string;
  endDateTimeRuleOneTask?: string;
  ruleTwoTask?: boolean;
  timePositionRegardingTaskId?: number;
  secondTaskId?: number;
  relationRangeId?: number;
  dateTimeRange?: string;
  isComplete?: boolean;
}

export type TaskAction = 'complete' | 'edit' | 'delete'; 