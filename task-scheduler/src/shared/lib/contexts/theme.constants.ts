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
        textSecondary: '#737373', 
        border: '#d9b7a0', 
        success: '#79bb49', 
        error: '#ff6b6b', 

        priorityStart: '#8b0000',    
        priorityEnd: '#ff6b6b',      

        priorityCompleted: '#d7d7d7', 
        priorityCompletedText: '#3a3a3a', 
        calendarHeader: '#d9b7a0', 
        calendarNavigation: '#f9f0e6', 
        edit: '#24b5ce' 
    }
  },
  {
    name: 'Темная',
    colors: {
        primary: '#868cccd3',
        secondary: '#868cccce',
        background: '#161618',
        surface: '#2d2d2dff',
        text: '#ffffff',
        textSecondary: '#d9d9d9ff',
        border: '#5f638a',
        success: '#52b3a6',
        error: '#e17f78',
        
        priorityStart: '#af51b9',    
        priorityEnd: '#3fc1b0',      

        priorityCompleted: '#b0bdde',
        priorityCompletedText: '#424242',

        calendarHeader: '#1f2125',
        calendarNavigation: '#393b4e',
        edit: '#b277d2' 

    }
  },
  {
    name: 'ЧБ',
    colors: {
        primary: '#22201fc0',
        secondary: '#b4aca6',
        background: '#f5f1ee',
        surface: '#e4e0ddff',//44403d
        text: '#1f1f1f',
        textSecondary: '#3a3735',
        border: '#1c1a19',
        success: '#817b76',
        error: '#817b76',

        edit: '#22201f',
        priorityStart: '#272422',    
        priorityEnd: '#bab2ac',      

        priorityCompleted: '#b9b9b9',
        priorityCompletedText: '#151515',

        calendarHeader: '#ded7d3',
        calendarNavigation: '#98918e'
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
        textSecondary: '#b1b1b1',
        border: '#bbdefb',
        success: '#4caf50',
        error: '#f44336',

        priorityStart: '#8b0000',    
        priorityEnd: '#ff6b6b',      

        priorityCompleted: '#f5f5f5',
        priorityCompletedText: '#666666',

        calendarHeader: '#bbdefb',
        calendarNavigation: '#e3f2fd',
        edit: '#21b8f3' 
    }
  }
];