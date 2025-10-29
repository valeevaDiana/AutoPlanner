import type { Theme } from './theme.types';

export const predefinedThemes: Theme[] = [
  {
    name: 'Светлая',
    colors: {
        primary: '#c68b5e', //основные кнопки (добавить задачу, -> <- итд)
        secondary: '#d9b7a0', //цвет столбика времени
        background: '#fff8f0', //фон таблицы и блока управления неделями
        surface: '#fff8f0', //фон модальных окон
        text: '#333333', //основной темный текст
        textSecondary: '#b1b1b1ff', //текст неосновного текста (плюсы и второстепенный текст)
        border: '#d9b7a0', //границы таблицы
        accent: '#27c5e1ff', //цвет при наведении
        success: '#79bb49ff', //кнопки успеха: выполнить задачу, сохранить изменения
        warning: '#de9f75ff', //hover "открыть задачу"
        error: '#ff6b6b', //отменить выполнение

        priorityStart: '#8b0000',    
        priorityEnd: '#ff6b6b',      
        priorityText: '#ffffff',

        priorityCompleted: '#d7d7d7ff', //цвет выполненной задачи
        priorityCompletedText: '#3a3a3aff', //текст выполненой задачи
        calendarHeader: '#d9b7a0', // шапка календаря
        calendarNavigation: '#f9f0e6', // навигация недель
        timeCell: '#f9f0e6', // ячейки времени
        edit: '#24b5ceff' //кнопка редактирования
    }
  },
  {
    name: 'Темная',
    colors: {
        primary: '#8b5a3c',
        secondary: '#6d4c41',
        background: '#1a1a1a',
        surface: '#2d2d2d',
        text: '#ffffff',
        textSecondary: '#b0b0b0',
        border: '#4a4a4a',
        accent: '#4caf50',
        success: '#4caf50',
        warning: '#ff9800',
        error: '#f44336',
        
        priorityStart: '#8b0000',    
        priorityEnd: '#ff6b6b',      
        priorityText: '#ffffff',

        priorityCompleted: '#404040',
        priorityCompletedText: '#888888',

        calendarHeader: '#3e2723',
        calendarNavigation: '#2d1b17',
        timeCell: '#2d1b17',
        edit: '#21b8f3ff' 

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
        accent: '#ff4081',
        success: '#6f4cafff',
        warning: '#ff9800',
        error: '#f44336',
        // priorityLow: '#ffc1ebff',
        // priorityLowText: '#880f6eff',
        // priorityMedium: '#ff93b7ff',
        // priorityMediumText: '#850d35ff',
        // priorityHigh: '#880f6eff',
        // priorityHighText: '#ffe6faff',
        priorityStart: '#ff4444',    
        priorityEnd: '#ffcccc',      
        priorityText: '#721717',     
        priorityCompleted: '#f5f5f5',
        priorityCompletedText: '#666666',

        calendarHeader: '#f8bbd9',
        calendarNavigation: '#fce4ec',
        timeCell: '#fce4ec',
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
        accent: '#2196f3',
        success: '#4caf50',
        warning: '#ff9800',
        error: '#f44336',

        priorityStart: '#8b0000',    
        priorityEnd: '#ff6b6b',      
        priorityText: '#ffffff',
        priorityCompleted: '#f5f5f5',
        priorityCompletedText: '#666666',

        calendarHeader: '#bbdefb',
        calendarNavigation: '#e3f2fd',
        timeCell: '#e3f2fd',
        edit: '#21b8f3ff' 
    }
  }
];