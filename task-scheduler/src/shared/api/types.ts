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

export interface ApiTimeTableResponse {
  tasks: ApiTask[];
}