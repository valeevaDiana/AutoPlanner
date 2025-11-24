import { useMemo } from 'react';
import type { Task } from '../../../entities/task/model/types';

export const useTaskSplitter = () => {
  const splitTaskByDays = (task: Task): Task[] => {
    if (!task.startDate || !task.startTime || !task.durationMinutes) {
      return [task];
    }

    const [startHours, startMinutes] = task.startTime.split(':').map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = startTotalMinutes + task.durationMinutes;

    if (Math.floor(endTotalMinutes / (24 * 60)) === Math.floor(startTotalMinutes / (24 * 60))) {
      return [task];
    }

    const parts: Task[] = [];
    let currentDate = task.startDate;
    let remainingMinutes = task.durationMinutes;
    let currentStartMinutes = startTotalMinutes;
    let partIndex = 0;


    while (remainingMinutes > 0 && partIndex < 10) {
      const minutesUntilEndOfDay = (24 * 60) - currentStartMinutes;
      const partDuration = Math.min(minutesUntilEndOfDay, remainingMinutes);

      const partHours = Math.floor(currentStartMinutes / 60);
      const partMinutes = currentStartMinutes % 60;
      const partTime = `${String(partHours).padStart(2, '0')}:${String(partMinutes).padStart(2, '0')}`;

      const part: Task = {
        ...task,
        startDate: currentDate,
        startTime: partTime,
        durationMinutes: partDuration,
        isSplitTask: true,
        parentTaskId: task.id,
        splitIndex: partIndex,
        realDate: currentDate,
      };

      parts.push(part);

      // Переход к следующему дню
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);
      const year = nextDate.getFullYear();
      const month = String(nextDate.getMonth() + 1).padStart(2, '0');
      const day = String(nextDate.getDate()).padStart(2, '0');
      currentDate = `${year}-${month}-${day}`;
      
      currentStartMinutes = 0;
      remainingMinutes -= partDuration;
      partIndex++;
    }

    return parts;
  };

  const splitAllTasks = (tasks: Task[]): Task[] => {
    return tasks.flatMap(task => {
      if (task.isSplitTask) return [task];
      return splitTaskByDays(task);
    });
  };

  const getOriginalTaskFromPart = (taskPart: Task, allTasks: Task[]): Task | null => {
    if (!taskPart.isSplitTask) return taskPart;
    
    const originalTask = allTasks.find(t => t.id === taskPart.parentTaskId && !t.isSplitTask);
    return originalTask || taskPart;
  };

  const getAllTaskParts = (task: Task, allTasks: Task[]): Task[] => {
    if (!task.isSplitTask) {
      return allTasks.filter(t => t.parentTaskId === task.id || t.id === task.id);
    } else {
      return allTasks.filter(t => t.parentTaskId === task.parentTaskId);
    }
  };

  return {
    splitTaskByDays,
    splitAllTasks,
    getOriginalTaskFromPart,
    getAllTaskParts,
  };
};