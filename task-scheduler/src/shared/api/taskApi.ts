import type { Task } from '../../entities/task/model/types';
import type { ApiTask, ApiTimeTableResponse, PenaltyTask } from './types';

const API_BASE_URL = '/api';
const STORAGE_KEY = 'autoplanner_tasks';
const STORAGE_KEY_PENALTY = 'autoplanner_penalty_tasks';

//локальные функции
export const localStorageApi = {
  getTasks: (): Task[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading tasks from localStorage:', error);
      return [];
    }
  },

  saveTasks: (tasks: Task[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  },

  getPenaltyTasks: (): PenaltyTask[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PENALTY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading penalty tasks from localStorage:', error);
      return [];
    }
  },

  savePenaltyTasks: (tasks: PenaltyTask[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY_PENALTY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving penalty tasks to localStorage:', error);
    }
  },

  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY_PENALTY);
  }
};

const formatToISO = (date: string, time: string = '00:00'): string => {
  if (!date) return '';
  return `${date}T${time}:00`;
};

const getWeekRange = () => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay() + 1 - 14);
  const end = new Date(now);
  end.setDate(now.getDate() - now.getDay() + 1 + 14);
  
  const toISOString = (date: Date) => date.toISOString().replace(/\.\d{3}Z$/, '');
  return {
    startTimeTable: toISOString(start),
    endDateTime: toISOString(end),
  };
};

const taskToFormData = (taskData: Partial<Task>, isUpdate = false): FormData => {
  const formData = new FormData();
  
  if (isUpdate && taskData.id) {
    formData.append('Id', taskData.id);
  }
  
  formData.append('Name', taskData.title || 'Без названия');
  const descriptionValue = taskData.description?.trim() === ' ' ? '-' : (taskData.description || '-');
  formData.append('Description', descriptionValue);
  formData.append('Priority', String(taskData.priority ?? 5));
  
  if (taskData.startDate && taskData.startTime) {
    formData.append('StartDateTime', `${taskData.startDate}T${taskData.startTime}:00`);
  } else {
    formData.append('StartDateTime', '');
  }
  
  if (taskData.endDate && taskData.endTime) {
    formData.append('EndDateTime', `${taskData.endDate}T${taskData.endTime}:00`);
  } else {
    formData.append('EndDateTime', '');
  }
  
  if (taskData.duration) {
    const l = taskData.duration.split(':').map(part => part.padStart(2, '0'))
      .join(':')
      .padEnd(11, ':00')
      .slice(0, 11);
    formData.append('Duration', l);
  }
  
  if (taskData.repeateDurationMinute) {
    formData.append('RepitTime', taskData.repeateDurationMinute);
  }
  
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

const taskToPlanningFormat = (task: Task) => ({
  Name: task.title || '',
  Description: task.description || '',
  Priority: task.priority,
  StartDateTime: task.startDate && task.startTime ? `${task.startDate}T${task.startTime}:00` : null,
  EndDateTime: task.endDate && task.endTime ? `${task.endDate}T${task.endTime}:00` : null,
  
  DurationString: task.duration || null, 
  
  IsRepit: task.isRepeating ?? false,
  CountRepit: task.repeatCount ?? 0,
  StartDateTimeRepit: task.startDateTimeRepit || null,
  EndDateTimeRepit: task.endDateTimeRepit || null,
  RuleOneTask: task.ruleOneTask ?? false,
  StartDateTimeRuleOneTask: task.startDateTimeRuleOneTask || null,
  EndDateTimeRuleOneTask: task.endDateTimeRuleOneTask || null,
  RuleTwoTask: task.ruleTwoTask ?? false,
  SecondTaskId: task.secondTaskId ?? 0,
  TimePositionRegardingTaskId: task.timePositionRegardingTaskId ?? 0,
  RelationRangeId: task.relationRangeId ?? 0,
  DateTimeRange: task.dateTimeRange || null,
});

const apiTaskToTask = (apiTask: ApiTask): Task => {
  const parseDate = (isoString: string | null | undefined): { date?: string; time?: string } => {
    if (!isoString) return {};
    try {
      const [datePart, timePart] = isoString.split('T');
      if (!datePart || !timePart) return {};
      const time = timePart.substring(0, 5);
      return { date: datePart, time: time };
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
  
  return {
    id: String(apiTask.id ?? apiTask.myTaskId ?? 'unknown'),
    title: apiTask.name || '',
    description: apiTask.description || '',
    priority: apiTask.priority || 5,
    startDate: start?.date || undefined,
    startTime: start?.time || undefined,
    endDate: end?.date || undefined,
    endTime: end?.time || undefined,
    duration: apiTask.duration || "",
    completed: Boolean(apiTask.isComplete),
    realDate: start?.date || new Date().toISOString().split('T')[0],
    isRepeating: Boolean(apiTask.isRepit),
    repeatCount: apiTask.countRepit || 0,
    startDateTimeRepit: apiTask.startDateTimeRepit || undefined,
    endDateTimeRepit: apiTask.endDateTimeRepit || undefined,
    repeateDurationMinute: apiTask.repitTime,
    ruleOneTask: Boolean(apiTask.ruleOneTask),
    startDateTimeRuleOneTask: apiTask.startDateTimeRuleOneTask || undefined,
    endDateTimeRuleOneTask: apiTask.endDateTimeRuleOneTask || undefined,
    ruleTwoTask: Boolean(apiTask.ruleTwoTask),
    timePositionRegardingTaskId: apiTask.timePositionRegardingTaskId,
    secondTaskId: apiTask.secondTaskId,
    relationRangeId: apiTask.relationRangeId,
    dateTimeRange: apiTask.dateTimeRange,
    isComplete: Boolean(apiTask.isComplete),
    countFrom: apiTask.countFrom,
  };
};

// === API Методы ===
export const taskApi = {
  async getTasks(): Promise<Task[]> {
    const localTasks = localStorageApi.getTasks();

    try {
      const { startTimeTable, endDateTime } = getWeekRange();
      
      const response = await fetch(`${API_BASE_URL}/time-table/recreate-local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tasks: localTasks.map(taskToPlanningFormat),
          startTimeTable,
          endDateTime
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.timeTableItems) {
          const plannedTasks = data.timeTableItems.map((item: ApiTask) => {
            const task = apiTaskToTask(item);
            task.realDate = item.startDateTime 
            ? item.startDateTime.split('T')[0] 
            : task.realDate;
            return task;
          });
          localStorageApi.saveTasks(plannedTasks);
          return plannedTasks;
        }
      }
    } catch (error) {
      console.error('Error planning tasks on backend:', error);
    }
    
    return localTasks;
  },
  
  async createTask(taskData: Partial<Task>): Promise<void> {
    const currentTasks = localStorageApi.getTasks();
    
    const newTask: Task = {
      ...taskData as Task,
      id: taskData.id || Date.now().toString(),
      completed: taskData.completed ?? false,
      realDate: taskData.startDate || new Date().toISOString().split('T')[0], 
    };

    currentTasks.push(newTask);
    localStorageApi.saveTasks(currentTasks);

    try {
      const formData = taskToFormData(taskData, false);
      await fetch(`${API_BASE_URL}/task`, {
        method: 'POST',
        body: formData,
      });
    } catch (error) {
      console.warn('Backend save failed, but local save OK:', error);
    }
    await this.rebuildTimeTable(currentTasks); 
  },
  
  async updateTask(taskData: Partial<Task>): Promise<void> {
    const currentTasks = localStorageApi.getTasks();
    const index = currentTasks.findIndex(t => t.id === taskData.id);
    
    if (index !== -1) {
      currentTasks[index] = { 
        ...currentTasks[index], 
        ...taskData,
        realDate: taskData.startDate || currentTasks[index].realDate,
      } as Task;
      localStorageApi.saveTasks(currentTasks);
    }
    
    try {
      const formData = taskToFormData(taskData, true);
      await fetch(`${API_BASE_URL}/task`, {
        method: 'PUT',
        body: formData,
      });
    } catch (error) {
      console.error('Error updating task on backend:', error);
    }
    
    await this.rebuildTimeTable();
  },
  
  async deleteTask(taskId: string): Promise<void> {
    const currentTasks = localStorageApi.getTasks();
    const filteredTasks = currentTasks.filter(t => t.id !== taskId);
    localStorageApi.saveTasks(filteredTasks);
    
    try {
      await fetch(`${API_BASE_URL}/task/${taskId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting task on backend:', error);
    }
    
    await this.rebuildTimeTable();
  },
  
  async completeTask(taskId: string): Promise<void> {
    const currentTasks = localStorageApi.getTasks();
    const index = currentTasks.findIndex(t => t.id === taskId);
    
    if (index !== -1) {
      currentTasks[index].completed = true;
      localStorageApi.saveTasks(currentTasks);
    }
    
    try {
      await fetch(`${API_BASE_URL}/task/complete/${taskId}`, {
        method: 'PUT',
      });
    } catch (error) {
      console.error('Error completing task on backend:', error);
    }
    
    await this.rebuildTimeTable();
  },
  
  async completeRepitTask(taskId: string, countFrom: number): Promise<void> {
    const currentTasks = localStorageApi.getTasks();
    const index = currentTasks.findIndex(t => t.id === taskId);
    
    if (index !== -1) {
      currentTasks[index].completed = true;
      localStorageApi.saveTasks(currentTasks);
    }
    
    try {
      const params = new URLSearchParams({
        taskId: taskId,
        countFrom: countFrom.toString(),
      });
      await fetch(`${API_BASE_URL}/task/complete/repit?${params}`, {
        method: 'PUT',
      });
    } catch (error) {
      console.error('Error completing repit task on backend:', error);
    }
    
    await this.rebuildTimeTable();
  },
  
  async rebuildTimeTable(tasksOverride?: Task[]): Promise<void> {
    const currentTasks = tasksOverride || localStorageApi.getTasks();

    console.log(`[DEBUG Frontend] Rebuilding timetable with ${currentTasks.length} tasks`); 

    if (currentTasks.length === 0) {
      console.warn('[WARN] No tasks to plan!');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/time-table/recreate-local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tasks: currentTasks.map(taskToPlanningFormat), 
          startTimeTable: new Date(Date.now() - 14*24*60*60*1000).toISOString(),
          endDateTime: new Date(Date.now() + 14*24*60*60*1000).toISOString()
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.timeTableItems) {
        const plannedTasks = data.timeTableItems.map((item: any) => {
          const task = apiTaskToTask(item);
          task.realDate = item.startDateTime 
            ? item.startDateTime.split('T')[0] 
            : task.realDate;
          return task;
        });
        localStorageApi.saveTasks(plannedTasks);
        console.log(`[DEBUG] Saved ${plannedTasks.length} planned tasks to localStorage`);
      }
      
      if (data.penaltyTasks) {
        localStorageApi.savePenaltyTasks(data.penaltyTasks);
      }
    } catch (error) {
      console.error('Error rebuilding timetable:', error);
    }
  },
  
  async getAvailableTasks(): Promise<Task[]> {
    const allTasks = localStorageApi.getTasks();
    return allTasks.filter(task => 
        task.startDate && 
        task.startDate.trim() !== '' && 
        task.startDate !== 'null' && 
        task.startDate !== 'undefined' && 
        task.isRepeating === false  
    );
  },
  
  async getTaskById(taskId: string): Promise<Task | null> {
    const allTasks = localStorageApi.getTasks();
    return allTasks.find(t => t.id === taskId) || null;
  },
  
  async getPenaltyTasks(): Promise<PenaltyTask[]> {
    return localStorageApi.getPenaltyTasks();
  },
  
  async clearAllData(): Promise<void> {
    localStorageApi.clearAll();
  }
};

export const telegramApi = {
  async generateTelegramCode(): Promise<{ code: string; telegramLink: string }> {
    return { code: '', telegramLink: '' };
  }
};