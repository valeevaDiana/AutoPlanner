export interface ApiTask {
  id?: number; 
  myTaskId?: number; 
  name: string;
  description?: string;
  createdDate?: string;
  priority: number;
  startDateTime?: string;
  endDateTime?: string;
  duration?: string;
  isRepit?: boolean;
  repitTime?: string;
  isRepitFromStart?: boolean;
  countRepit?: number;
  startDateTimeRepit?: string;
  endDateTimeRepit?: string;
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

export interface PenaltyTask {
  userId: number;
  myTaskId: number;
  name: string;
  description: string;
  priority: number;
  startDateTime: string;
  endDateTime: string;
  duration: string;
  countFrom: number;
  isComplete: boolean;
  completeDateTime: string | null;
  startDateTimeRange: string | null;
  endDateTimeRange: string | null;
  ruleOneTask: boolean;
  startDateTimeRuleOneTask: string | null;
  endDateTimeRuleOneTask: string | null;
  ruleTwoTask: boolean;
  timePositionRegardingTaskId: number;
  secondTaskId: number;
  relationRangeId: number;
  dateTimeRange: string | null;
}

export interface ApiTimeTableResponse {
  timeTableItems: ApiTask[];
  penaltyTasks: PenaltyTask[];
}

// export interface ApiTimeTableResponse {
//   tasks: ApiTask[];
// }