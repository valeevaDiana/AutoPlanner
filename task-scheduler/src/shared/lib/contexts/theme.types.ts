// import type { ReactNode } from 'react';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  
  success: string;
  error: string;
  edit: string;  

  priorityStart: string;    
  priorityEnd: string;      
  priorityCompleted: string;
  priorityCompletedText: string;
  
  calendarHeader: string;        
  calendarNavigation: string;    
}

export interface Theme {
  name: string;
  colors: ThemeColors;
}

export interface ThemeContextType {
  currentTheme: Theme;
  customThemes: Theme[];
  setTheme: (themeName: string) => void;
  addCustomTheme: (theme: Theme) => void;
  updateCurrentTheme: (colors: Partial<Theme['colors']>) => void;
  isCustomizerOpen: boolean;
  setIsCustomizerOpen: (open: boolean) => void;
}