import type { Theme } from './theme.types';

export const predefinedThemes: Theme[] = [
  {
    name: 'Светлая',
    colors: {
        primary: '#334f35df',
        secondary: '#426545af',
        background: '#fffdde',
        surface: '#fff8e1',
        text: '#19281aff', 
        textSecondary: '#274129', 
        border: '#d1a7ab', 
        success: '#74bc7a', 
        error: '#74bc7a', 

        priorityHigh: '#ff5b6c',    
        priorityLow: '#ffdcdf',      

        priorityCompleted: '#bbc3bbff', 
        priorityCompletedText: '#19281a', 
        calendarHeader: '#fdb4bb', 
        calendarNavigation: '#48764ca3', 
        edit: '#e88f98' 
    }
  },
  {
    name: 'Серая',
    colors: {
        primary: '#22201fc0',
        secondary: '#b4aca6',
        background: '#f5f1ee',
        surface: '#e4e0dd',//44403d
        text: '#1f1f1f',
        textSecondary: '#3a3735',
        border: '#1c1a19',
        success: '#817b76',
        error: '#817b76',

        edit: '#22201f',
        priorityHigh: '#272422',    
        priorityLow: '#bab2ac',      

        priorityCompleted: '#b9b9b9',
        priorityCompletedText: '#151515',

        calendarHeader: '#ded7d3',
        calendarNavigation: '#98918e'
    }
  },
  {
    name: 'Яркая',
    colors: {
        primary: '#232849df',
        secondary: '#e96f4a',
        background: '#e6d5b7',
        surface: '#f1e8d7',
        text: '#0f111d',
        textSecondary: '#1e223d',
        border: '#48392a',
        success: '#5da98bff',
        error: '#e96f4a',
        edit: '#748c9cff',

        priorityHigh: '#e86a44',    
        priorityLow: '#2a3053',      

        priorityCompleted: '#a1a1a6',
        priorityCompletedText: '#16192d',

        calendarHeader: '#8b94af',
        calendarNavigation: '#ea6138',
    }
  },
  {
    name: 'Темная',
    colors: {
        primary: '#868cccd3',
        secondary: '#868cccce',
        background: '#161618',
        surface: '#2d2d2d',
        text: '#ffffff',
        textSecondary: '#d9d9d9',
        border: '#5f638a',
        success: '#52b3a6',
        error: '#e17f78',
        
        priorityHigh: '#af51b9',    
        priorityLow: '#3fc1b0',      

        priorityCompleted: '#b0bdde',
        priorityCompletedText: '#424242',

        calendarHeader: '#1f2125',
        calendarNavigation: '#393b4e',
        edit: '#b277d2' 

    }
  },
  {
    name: 'Ржавая',
    colors: {
        primary: '#ffb25fc0',
        secondary: '#aa5047',
        background: '#251f18',
        surface: '#322c24',
        text: '#f5f0ebff',
        textSecondary: '#e6e1db',
        border: '#48392a',
        success: '#648862',
        error: '#aa5047',
        edit: '#748c9cff',

        priorityHigh: '#974242',    
        priorityLow: '#dfa05d',      

        priorityCompleted: '#979f97',
        priorityCompletedText: '#333633',

        calendarHeader: '#648862',
        calendarNavigation: '#3f5a3d',
    }
  }
];