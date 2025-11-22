import type { Theme } from './theme.types';

export const predefinedThemes: Theme[] = [
  {
    name: 'Светлая',
    colors: {
        primary: '#334f35df',
        secondary: '#90b894',
        background: '#fff8e1',
        surface: '#fff4d4',
        text: '#19281a', 
        textSecondary: '#274129', 
        border: '#648367', 
        success: '#74bc7a', 
        error: '#b74c57', 

        priorityHigh: '#ff5b6c',    
        priorityLow: '#ffdcdf',      

        priorityCompleted: '#bbc3bb', 
        priorityCompletedText: '#19281a', 
        calendarHeader: '#fdb4bb', 
        calendarNavigation: '#48764ca3', 
        edit: '#e88f98' 
    }
  },
  {
    name: 'Розовая',
    colors: {
        primary: '#e25b6fc6',
        secondary: '#ffdbc8',
        background: '#fff7f7',
        surface: '#fff0f0',
        text: '#2b171a', 
        textSecondary: '#3b1c20', 
        border: '#c89579', 

        success: '#e3a27f', 
        error: '#ce3847',
        edit: '#f580a5' , 

        priorityHigh: '#ff5b6c',    
        priorityLow: '#ffdcdf',      

        priorityCompleted: '#c3bbbd', 
        priorityCompletedText: '#28191c', 
        calendarHeader: '#fdb4bb', 
        calendarNavigation: '#ffdbc8'
    }
  },
  {
    name: 'Яркая',
    colors: {
        primary: '#232849df',
        secondary: '#e96f4a',
        background: '#f7ebd5',
        surface: '#f1e8d7',
        text: '#0f111d',
        textSecondary: '#1e223d',
        border: '#48392a',
        success: '#5da98b',
        error: '#e96f4a',
        edit: '#748c9c',

        priorityHigh: '#e86a44',    
        priorityLow: '#2a3053',      

        priorityCompleted: '#a1a1a6',
        priorityCompletedText: '#16192d',

        calendarHeader: '#8b94af',
        calendarNavigation: '#ea6138',
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
    name: 'Темная',
    colors: {
        primary: '#868cccd3',
        secondary: '#757aae',
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
        background: '#12100eff',
        surface: '#322c24',
        text: '#f5f0eb',
        textSecondary: '#e6e1db',
        border: '#48392a',
        success: '#648862',
        error: '#aa5047',
        edit: '#748c9c',

        priorityHigh: '#974242',    
        priorityLow: '#dfa05d',      

        priorityCompleted: '#979f97',
        priorityCompletedText: '#333633',

        calendarHeader: '#648862',
        calendarNavigation: '#3f5a3d',
    }
  }
];