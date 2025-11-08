import type { Task } from '../../entities/task/model/types';
import type { ApiTask, ApiTimeTableResponse } from './types';

const API_BASE_URL = 'http://backend:8080';

// Вспомогательные функции для преобразования форматов
const formatToISO = (date: string, time: string = '00:00'): string => {
  if (!date) return '';
  return `${date}T${time}:00`;
};

const formatDuration = (days: number, hours: number, minutes: number): string => {
  return `P${days}DT${hours}H${minutes}M`;
};

const parseDuration = (duration: string): { days: number; hours: number; minutes: number } => {
  if (!duration) return { days: 0, hours: 0, minutes: 0 };
  
  const dayMatch = duration.match(/(\d+)D/);
  const hourMatch = duration.match(/(\d+)H/);
  const minuteMatch = duration.match(/(\d+)M/);
  
  return {
    days: dayMatch ? parseInt(dayMatch[1]) : 0,
    hours: hourMatch ? parseInt(hourMatch[1]) : 0,
    minutes: minuteMatch ? parseInt(minuteMatch[1]) : 0,
  };
};

const minutesToDuration = (totalMinutes: number) => {
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  return { days, hours, minutes };
};

// Преобразование Task в форму для API
const taskToFormData = (taskData: Partial<Task>, isUpdate: boolean = false): FormData => {
  const formData = new FormData();
  
  if (isUpdate && taskData.id) {
    formData.append('Id', taskData.id);
  }
  
  formData.append('Name', taskData.title || taskData.content || '');
  formData.append('Description', taskData.description || '');
  formData.append('Priority', String(taskData.priority || 5));
  
  if (taskData.startDate) {
    formData.append('StartDateTime', formatToISO(taskData.startDate, taskData.startTime));
  }
  
  if (taskData.endDate) {
    formData.append('EndDateTime', formatToISO(taskData.endDate, taskData.endTime));
  }
  
  if (taskData.durationMinutes) {
    const duration = minutesToDuration(taskData.durationMinutes);
    formData.append('Duration', formatDuration(duration.days, duration.hours, duration.minutes));
  }
  
  // Поля для повторяющихся задач (пока заглушки)
  formData.append('IsRepit', 'false');
  formData.append('IsRepitFromStart', 'false');
  formData.append('CountRepit', '0');
  
  // Поля для правил (пока заглушки)
  formData.append('RuleOneTask', 'false');
  formData.append('RuleTwoTask', 'false');
  
  if (isUpdate) {
    formData.append('IsComplete', String(taskData.completed || false));
    if (taskData.completed) {
      formData.append('CompleteDateTime', new Date().toISOString());
    }
  }
  
  return formData;
};

// Преобразование данных из API в формат фронтенда
const apiTaskToTask = (apiTask: ApiTask): Task => {
  const startDate = apiTask.startDateTime ? new Date(apiTask.startDateTime) : null;
  const endDate = apiTask.endDateTime ? new Date(apiTask.endDateTime) : null;
  
  // Вычисляем durationMinutes из поля duration или используем значение по умолчанию
  let durationMinutes = 60;
  if (apiTask.duration) {
    const duration = parseDuration(apiTask.duration);
    durationMinutes = duration.days * 24 * 60 + duration.hours * 60 + duration.minutes;
  }
  
  // Получаем время в формате HH:MM
  const getTimeString = (date: Date | null): string => {
    if (!date) return '00:00';
    return date.toTimeString().substring(0, 5);
  };
  
  // Получаем дату в формате YYYY-MM-DD
  const getDateString = (date: Date | null): string | undefined => {
    if (!date) return undefined;
    return date.toISOString().split('T')[0];
  };

  return {
    id: apiTask.id.toString(),
    time: getTimeString(startDate),
    content: apiTask.name || '',
    priority: apiTask.priority || 5,
    durationMinutes,
    startMinute: 0,
    completed: apiTask.isComplete || false,
    title: apiTask.name || '',
    description: apiTask.description || '',
    startDate: getDateString(startDate),
    endDate: getDateString(endDate),
    startTime: getTimeString(startDate),
    endTime: getTimeString(endDate),
    realDate: getDateString(startDate) || new Date().toISOString().split('T')[0],
  };
};

// API методы
export const taskApi = {
  async getTasks(userId: number): Promise<Task[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/time-table/${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiTimeTableResponse | ApiTask[] = await response.json();
      
      let tasks: ApiTask[];
      
      if (Array.isArray(data)) {
        tasks = data;
      } else if (data && 'tasks' in data) {
        tasks = data.tasks;
      } else {
        console.warn('Unexpected response format:', data);
        tasks = [];
      }
      
      return tasks.map(apiTaskToTask);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Создание задачи
  async createTask(taskData: Partial<Task>, userId: number): Promise<void> {
    try {
      const formData = taskToFormData(taskData, false);
      
      const response = await fetch(`${API_BASE_URL}/task?userId=${userId}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Обновление задачи
  async updateTask(taskData: Partial<Task>): Promise<void> {
    try {
      const formData = taskToFormData(taskData, true);
      
      const response = await fetch(`${API_BASE_URL}/task`, {
        method: 'PUT',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Удаление задачи
  async deleteTask(taskId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/task/${taskId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // Отметка задачи как выполненной/невыполненной
  async completeTask(taskId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/task/complete/${taskId}`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  },
};