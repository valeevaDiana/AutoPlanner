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
        textSecondary: '#666666', //текст неосновного текста (плюсы и второстепенный текст)
        border: '#d9b7a0', //границы таблицы
        accent: '#27c5e1ff', //цвет при наведении
        success: '#79bb49ff', //кнопки успеха: выполнить задачу, сохранить изменения
        warning: '#de9f75ff', //hover "открыть задачу"
        error: '#ff6b6b', //отменить выполнение
        priorityLow: '#c0ffc0ff', //цвет фона низкого приоритета
        priorityLowText: '#205623', //текст низкого приоритета
        priorityMedium: '#fff6a3ff', //фон среднего приоритета
        priorityMediumText: '#974f0f', //текст среднего приоритета
        priorityHigh: '#ffceceff', //фон высокого приоритета
        priorityHighText: '#721717', //текст высокого приоритета
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
        priorityLow: '#1a331a',
        priorityLowText: '#88cc88',
        priorityMedium: '#332b1a',
        priorityMediumText: '#ffcc66',
        priorityHigh: '#331a1a',
        priorityHighText: '#ff6666',
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
        textSecondary: '#666666',
        border: '#f8bbd9',
        accent: '#ff4081',
        success: '#6f4cafff',
        warning: '#ff9800',
        error: '#f44336',
        priorityLow: '#ffc1ebff',
        priorityLowText: '#880f6eff',
        priorityMedium: '#ff93b7ff',
        priorityMediumText: '#850d35ff',
        priorityHigh: '#880f6eff',
        priorityHighText: '#ffe6faff',
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
        textSecondary: '#666666',
        border: '#bbdefb',
        accent: '#2196f3',
        success: '#4caf50',
        warning: '#ff9800',
        error: '#f44336',
        priorityLow: '#c7e8ffff',
        priorityLowText: '#0d47a1',
        priorityMedium: '#4fb6e6ff',
        priorityMediumText: '#0d47a1',
        priorityHigh: '#18688dff',
        priorityHighText: '#eff6ffff',
        priorityCompleted: '#f5f5f5',
        priorityCompletedText: '#666666',

        calendarHeader: '#bbdefb',
        calendarNavigation: '#e3f2fd',
        timeCell: '#e3f2fd',
        edit: '#21b8f3ff' 
    }
  }
];