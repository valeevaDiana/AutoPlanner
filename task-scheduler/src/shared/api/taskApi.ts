import type { Task } from '../../entities/task/model/types';
import type { ApiTask, ApiTimeTableResponse, PenaltyTask } from './types';

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

    console.log('Task data for form:', {
    id: taskData.id,
    title: taskData.title,
    description: taskData.description,
    descriptionLength: taskData.description?.length
  });

  if (isUpdate && taskData.id) {
    formData.append('Id', taskData.id);
  }
  formData.append('Name', taskData.title || 'Без названия');

  const descriptionValue = taskData.description?.trim() === '' ? '-' : (taskData.description || '-');
  formData.append('Description', descriptionValue);

  formData.append('Priority', String(taskData.priority ?? 5));

  if (taskData.startDate && taskData.startTime) {
    formData.append('StartDateTime', `${taskData.startDate}T${taskData.startTime}:00.000Z`);
  } else {
    formData.append('StartDateTime', ''); 
  }

  if (taskData.endDate && taskData.endTime) {
    formData.append('EndDateTime', `${taskData.endDate}T${taskData.endTime}`);
  } else {
    formData.append('EndDateTime', '');
  }

  const totalMinutes = taskData.durationMinutes ?? 60;
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  formData.append('Duration', formatDuration(days, hours, minutes));

  const repitTotalMinutes = taskData.repeateDurationMinute ?? 60;
  const repitDays = Math.floor(repitTotalMinutes / (24 * 60));
  const repitHours = Math.floor((repitTotalMinutes % (24 * 60)) / 60);
  const repitMinutes = repitTotalMinutes % 60;
  formData.append('RepitTime', formatDuration(repitDays, repitHours, repitMinutes));
  formData.append('IsRepitFromStart', 'false');
  formData.append('IsRepit', String(Boolean(taskData.isRepeating)));
  formData.append('CountRepit', String(taskData.repeatCount || 0));

  if (taskData.startDateTimeRepit) {
    formData.append('StartDateTimeRepit', taskData.startDateTimeRepit);
  }
  
  if (taskData.endDateTimeRepit) {
    formData.append('EndDateTimeRepit', taskData.endDateTimeRepit);
  }

  formData.append('RuleOneTask', String(Boolean(taskData.ruleOneTask)));
    
    if (taskData.ruleOneTask && taskData.startDateTimeRuleOneTask) {
      formData.append('StartDateTimeRuleOneTask', taskData.startDateTimeRuleOneTask);
    }
    
    if (taskData.ruleOneTask && taskData.endDateTimeRuleOneTask) {
      formData.append('EndDateTimeRuleOneTask', taskData.endDateTimeRuleOneTask);
    }

  if (isUpdate) {
    formData.append('IsComplete', String(Boolean(taskData.completed)));
    if (taskData.completed) {
      formData.append('CompleteDateTime', new Date().toISOString());
    }
  }

   formData.append('RuleTwoTask', String(Boolean(taskData.ruleTwoTask)));
  
  if (taskData.ruleTwoTask) {
    if (taskData.secondTaskId !== undefined) {
      formData.append('SecondTaskId', String(taskData.secondTaskId));
    }
    if (taskData.timePositionRegardingTaskId !== undefined) {
      formData.append('TimePositionRegardingTaskId', String(taskData.timePositionRegardingTaskId));
    }
    if (taskData.relationRangeId !== undefined) {
      formData.append('RelationRangeId', String(taskData.relationRangeId));
    }
    if (taskData.dateTimeRange) {
      formData.append('DateTimeRange', taskData.dateTimeRange);
    }
  }

  return formData;
};

const apiTaskToTask = (apiTask: ApiTask): Task => {
  const parseDate = (isoString: string | null | undefined): { date?: string; time?: string } => {
    if (!isoString) return {};
  
    try {
      const date = new Date(isoString);
      const datePart = date.toISOString().slice(0, 10);  
      const timePart = date.toISOString().slice(11, 16); 

      return {
        date: datePart,
        time: timePart,    
      };
    } catch (error) {
      console.error('Error parsing date:', isoString, error);
      return {};
    }
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

      const year = endDate.getFullYear();
      const month = String(endDate.getMonth() + 1).padStart(2, '0');
      const day = String(endDate.getDate()).padStart(2, '0');
      const endHours = String(endDate.getHours()).padStart(2, '0');
      const endMinutes = String(endDate.getMinutes()).padStart(2, '0');

      end = {
        date: `${year}-${month}-${day}`,
        time: `${endHours}:${endMinutes}`,
      };
    }
  }

  let durationMinutes = 0;
  if (apiTask.duration) {
    const match = apiTask.duration.match(/(\d+):(\d+):(\d+)/);
    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      durationMinutes = hours * 60 + minutes;
    }
  } else {
    if (apiTask.startDateTime && apiTask.endDateTime) {
      durationMinutes = Math.round((new Date(apiTask.endDateTime).getTime() - new Date(apiTask.startDateTime).getTime()) / (1000 * 60));
    }
  }

  // ДОБАВЛЕНО: Расчет repeateDurationMinute из repitTime
  let repeateDurationMinute = 0;
  if (apiTask.repitTime) {
    const repitMatch = apiTask.repitTime.match(/(\d+):(\d+):(\d+)/);
    if (repitMatch) {
      const repitHours = parseInt(repitMatch[1], 10);
      const repitMinutes = parseInt(repitMatch[2], 10);
      repeateDurationMinute = repitHours * 60 + repitMinutes;
    }
  }

  // ДОБАВЛЕНО: Парсинг дат для повторяющихся задач
  const startRepit = parseDate(apiTask.startDateTimeRepit);
  const endRepit = parseDate(apiTask.endDateTimeRepit);

  // ДОБАВЛЕНО: Парсинг дат для rule one task
  const startRuleOne = parseDate(apiTask.startDateTimeRuleOneTask);
  const endRuleOne = parseDate(apiTask.endDateTimeRuleOneTask);

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
    
    // ДОБАВЛЕНО: Поля для повторяющихся задач
    isRepeating: Boolean(apiTask.isRepit),
    repeatCount: apiTask.countRepit || 0,
    startDateTimeRepit: apiTask.startDateTimeRepit || undefined,
    endDateTimeRepit: apiTask.endDateTimeRepit || undefined,
    repeateDurationMinute,
    
    // ДОБАВЛЕНО: Поля для rule one task (возможное время)
    ruleOneTask: Boolean(apiTask.ruleOneTask),
    startDateTimeRuleOneTask: apiTask.startDateTimeRuleOneTask || undefined,
    endDateTimeRuleOneTask: apiTask.endDateTimeRuleOneTask || undefined,
    
    // ДОБАВЛЕНО: Поля для rule two task (зависимости)
    ruleTwoTask: Boolean(apiTask.ruleTwoTask),
    timePositionRegardingTaskId: apiTask.timePositionRegardingTaskId,
    secondTaskId: apiTask.secondTaskId,
    relationRangeId: apiTask.relationRangeId,
    dateTimeRange: apiTask.dateTimeRange,
    
    // ДОБАВЛЕНО: Дублирующее поле для совместимости
    isComplete: Boolean(apiTask.isComplete),
  };
};

// === API Методы ===

export const taskApi = {
  async getTasks(userId: number): Promise<Task[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/time-table/${userId}`);
      if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
      
      const data = await response.json();
      console.log('Raw API response:', data); 
      
      let tasks: ApiTask[];

      if (Array.isArray(data)) {
        tasks = data;
      } else if (data && 'tasks' in data) {
        tasks = data.tasks;
      } else if (data && 'timeTableItems' in data) {

        tasks = data.timeTableItems;
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
      console.error('Error creating task:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        taskData: taskData,
        userId: userId,
        stack: error instanceof Error ? error.stack : undefined
      });

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

  async getAvailableTasks(userId: number): Promise<Task[]> {
    try {
      // Получаем задачи напрямую из эндпоинта /task/{userId}
      const response = await fetch(`${API_BASE_URL}/task/${userId}`);
      
      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Пользователь с таким ID не найден');
        } else if (response.status === 500) {
          throw new Error('Ошибка при получении задач');
        } else {
          throw new Error(`Ошибка загрузки: ${response.status}`);
        }
      }
      
      const data = await response.json();
      
      // Предполагаем, что ответ содержит массив задач в формате ApiTask
      let tasks: ApiTask[];
      
      if (Array.isArray(data)) {
        tasks = data;
      } else if (data && 'tasks' in data) {
        tasks = data.tasks;
      } else {
        console.warn('Unexpected response format from /task endpoint:', data);
        tasks = [];
      }
      
      // Конвертируем ApiTask в Task и фильтруем
      const allTasks = tasks.map(apiTaskToTask);
      
      // Фильтруем задачи: оставляем только те, у которых startDate не null/undefined и не пустая строка
      const availableTasks = allTasks.filter(task => 
        task.startDate && 
        task.startDate.trim() !== '' && 
        task.startDate !== 'null' && 
        task.startDate !== 'undefined' && task.isRepeating == false
      );
      
      return availableTasks;
    } catch (error) {
      console.error('Error fetching available tasks from /task endpoint:', error);
      return [];
    }
  },

  async getTaskById(taskId: string): Promise<Task | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/id/${taskId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Task with ID ${taskId} not found`);
          return null;
        } else {
          throw new Error(`HTTP ${response.status}: Failed to fetch task`);
        }
      }
      
      const taskData: ApiTask = await response.json();
      
      // Конвертируем ApiTask в Task
      const task = apiTaskToTask(taskData);
      
      console.log(`Successfully loaded task: ${task.title} (ID: ${task.id})`);
      return task;
      
    } catch (error) {
      console.error('Error fetching task by ID:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        taskId: taskId,
        endpoint: `${API_BASE_URL}/task/id/${taskId}`
      });
      return null;
    }
  },

  async getPenaltyTasks(userId: number): Promise<PenaltyTask[]> {
    try {
      const response = await fetch(`/api/time-table/${userId}`);
      if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
      
      const data = await response.json();
      return data.penaltyTasks || [];
    } catch (error) {
      console.error('Error loading penalty tasks:', error);
      return [];
    }
  }
};