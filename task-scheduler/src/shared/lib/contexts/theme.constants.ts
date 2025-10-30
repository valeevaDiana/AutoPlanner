import type { Theme } from './theme.types';

export const predefinedThemes: Theme[] = [
  {
    name: 'Светлая',
    colors: {
        primary: '#c68b5e',
        secondary: '#d9b7a0',
        background: '#fff8f0',
        surface: '#fff8f0',
        text: '#333333', 
        textSecondary: '#b1b1b1ff', 
        border: '#d9b7a0', 
        success: '#79bb49ff', 
        error: '#ff6b6b', 

        priorityStart: '#8b0000',    
        priorityEnd: '#ff6b6b',      

        priorityCompleted: '#d7d7d7ff', 
        priorityCompletedText: '#3a3a3aff', 
        calendarHeader: '#d9b7a0', 
        calendarNavigation: '#f9f0e6', 
        edit: '#24b5ceff' 
    }
  },
  {
    name: 'Темная',
    colors: {
        primary: '#868cccbf',
        secondary: '#868cccce',
        background: '#161618',
        surface: '#1f1f1f',
        text: '#ffffff',
        textSecondary: '#c5c5c5',
        border: '#868ccc',
        success: '#52b3a6',
        error: '#e17f78',
        
        priorityStart: '#af51b9',    
        priorityEnd: '#3fc1b0',      

        priorityCompleted: '#e3e3e3',
        priorityCompletedText: '#424242',

        calendarHeader: '#1f2125',
        calendarNavigation: '#868ccc53',
        edit: '#b277d2' 

    }
  },
  {
    name: 'Розовая',
    colors: {
        primary: '#e91e63',
        secondary: '#f8bbd9',
        background: '#fff0f5',
        surface: '#ffffff',
        text: '#333333',
        textSecondary: '#b1b1b1ff',
        border: '#f8bbd9',
        success: '#6f4cafff',
        error: '#f44336',

        priorityStart: '#ff4444',    
        priorityEnd: '#ffcccc',      

        priorityCompleted: '#f5f5f5',
        priorityCompletedText: '#666666',

        calendarHeader: '#f8bbd9',
        calendarNavigation: '#fce4ec',
        edit: '#21b8f3ff' 
    }
  },
  {
    name: 'Синяя',
    colors: {
        primary: '#2196f3',
        secondary: '#bbdefb',
        background: '#f3f8ff',
        surface: '#ffffff',
        text: '#333333',
        textSecondary: '#b1b1b1ff',
        border: '#bbdefb',
        success: '#4caf50',
        error: '#f44336',

        priorityStart: '#8b0000',    
        priorityEnd: '#ff6b6b',      

        priorityCompleted: '#f5f5f5',
        priorityCompletedText: '#666666',

        calendarHeader: '#bbdefb',
        calendarNavigation: '#e3f2fd',
        edit: '#21b8f3ff' 
    }
  }
];