import type { Task } from '../../entities/task/model/types';
import type { ApiTask, ApiTimeTableResponse } from './types';

const API_BASE_URL = '/api'; 

const formatToISO = (date: string, time: string = '00:00'): string => {
  if (!date) return '';
  return `${date}T${time}:00`;
};

const parseDuration = (durationStr: string): number => {
  const days = parseInt(durationStr.match(/(\d+)D/)?.[1] || '0', 10);
  const hours = parseInt(durationStr.match(/(\d+)H/)?.[1] || '0', 10);
  const minutes = parseInt(durationStr.match(/(\d+)M/)?.[1] || '0', 10);
  return days * 24 * 60 + hours * 60 + minutes;
};

const formatDuration = (days: number, hours: number, minutes: number): string => {
  const totalHours = days * 24 + hours;
  return `${String(totalHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
};

const taskToFormData = (taskData: Partial<Task>, isUpdate = false): FormData => {
  const formData = new FormData();

  if (isUpdate && taskData.id) {
    formData.append('Id', taskData.id);
  }

  formData.append('Name', taskData.title || 'Без названия');
  if (taskData.description) formData.append('Description', taskData.description);
  formData.append('Priority', String(taskData.priority ?? 5));

  if (taskData.startDate && taskData.startTime) {
    formData.append('StartDateTime', formatToISO(taskData.startDate, taskData.startTime));
  }
  if (taskData.endDate && taskData.endTime) {
    formData.append('EndDateTime', formatToISO(taskData.endDate, taskData.endTime));
  }

  const totalMinutes = taskData.durationMinutes ?? 60;
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  formData.append('Duration', formatDuration(days, hours, minutes));

  // Пока не реализуем повторения и правила
  formData.append('IsRepit', 'false');
  formData.append('RuleOneTask', 'false');
  formData.append('RuleTwoTask', 'false');

  if (isUpdate) {
    formData.append('IsComplete', String(Boolean(taskData.completed)));
    if (taskData.completed) {
      formData.append('CompleteDateTime', new Date().toISOString());
    }
  }

  return formData;
};

const apiTaskToTask = (apiTask: ApiTask): Task => {
  const parseDate = (isoString: string | null | undefined): { date?: string; time?: string } => {
    if (!isoString) return {};
    const date = new Date(isoString);
    return {
      date: date.toISOString().split('T')[0],
      time: date.toTimeString().slice(0, 5),
    };
  };

  const start = parseDate(apiTask.startDateTime);

  let end = parseDate(apiTask.endDateTime);

  if (!apiTask.endDateTime && apiTask.duration && apiTask.startDateTime) {
    const startMs = new Date(apiTask.startDateTime).getTime();
    const durationMatch = apiTask.duration.match(/(\d+):(\d+):(\d+)/);
    if (durationMatch) {
      const hours = parseInt(durationMatch[1], 10);
      const minutes = parseInt(durationMatch[2], 10);
      const seconds = parseInt(durationMatch[3], 10);
      const durationMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
      const endMs = startMs + durationMs;
      const endDate = new Date(endMs);
      end = {
        date: endDate.toISOString().split('T')[0],
        time: endDate.toTimeString().slice(0, 5),
      };
    }
  }

  let durationMinutes = 60;
  if (apiTask.duration) {
    const match = apiTask.duration.match(/(\d+):(\d+):(\d+)/);
    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      durationMinutes = hours * 60 + minutes;
    }
  }

  return {
    id: String(apiTask.id ?? apiTask.myTaskId ?? 'unknown'), 
    title: apiTask.name || '',
    description: apiTask.description || '',
    priority: apiTask.priority || 5,
    startDate: start?.date || undefined,
    startTime: start?.time || undefined,
    endDate: end?.date || undefined,
    endTime: end?.time || undefined,
    durationMinutes,
    completed: Boolean(apiTask.isComplete),
    realDate: start?.date || new Date().toISOString().split('T')[0],
  };
};

// === API Методы ===

export const taskApi = {
  async getTasks(userId: number): Promise<Task[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/time-table/${userId}`);
      if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
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
      return [];
    }
  },

  async createTask(taskData: Partial<Task>, userId: number): Promise<void> {
    try {
      const formData = taskToFormData(taskData, false);
      const response = await fetch(`${API_BASE_URL}/task?userId=${userId}`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error(`Ошибка создания: ${response.status}`);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  async updateTask(taskData: Partial<Task>): Promise<void> {
    try {
      const formData = taskToFormData(taskData, true);
      const response = await fetch(`${API_BASE_URL}/task`, {
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) throw new Error(`Ошибка обновления: ${response.status}`);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  async deleteTask(taskId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/task/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`Ошибка удаления: ${response.status}`);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  async completeTask(taskId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/task/complete/${taskId}`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error(`Ошибка завершения: ${response.status}`);
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  },

  async rebuildTimeTable(
    userId: number,
    startTimeTable: string,
    endDateTime: string
  ): Promise<void> {
    try {
      const params = new URLSearchParams({
        userId: userId.toString(),
        startTimeTable,
        endDateTime,
      });

      const response = await fetch(`${API_BASE_URL}/time-table?${params}`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error(`Ошибка перестройки: ${response.status}`);
    } catch (error) {
      console.error('Error rebuilding timetable:', error);
      throw error;
    }
  },
};