import type { ReactNode } from 'react';

export interface ThemeColors {
  // Основные цвета
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  
  // Цвета состояний
  success: string;
  warning: string;
  error: string;
  edit: string;  
  
  // Цвета приоритетов задач
  priorityLow: string;
  priorityLowText: string;
  priorityMedium: string;
  priorityMediumText: string;
  priorityHigh: string;
  priorityHighText: string;
  priorityCompleted: string;
  priorityCompletedText: string;
  
  calendarHeader: string;        
  calendarNavigation: string;    
  timeCell: string;              
}
