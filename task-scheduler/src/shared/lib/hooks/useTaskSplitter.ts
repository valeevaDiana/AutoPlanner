import { useMemo } from 'react';
import type { Task } from '../../../entities/task/model/types';

export const useTaskSplitter = () => {
    const splitTaskByDays = (task: Task): Task[] => {
        if (!task.startDate || !task.startTime || !task.durationMinutes) {
            return [task];
        }

        const startDateTime = new Date(`${task.startDate}T${task.startTime}:00Z`);
        const endDateTime = new Date(startDateTime.getTime() + task.durationMinutes * 60000);

        console.log('Splitting task:', {
            task: task.title,
            start: startDateTime.toISOString(),
            end: endDateTime.toISOString(),
            duration: task.durationMinutes,
            startDate: task.startDate,
            startTime: task.startTime
        });

        if (startDateTime.toISOString().split('T')[0] === endDateTime.toISOString().split('T')[0]) {
            return [task];
        }

        const parts: Task[] = [];
        let currentStart = new Date(startDateTime);
        let remainingMinutes = task.durationMinutes;
        let partIndex = 0;

        while (remainingMinutes > 0 && partIndex < 10) {
            const dayEnd = new Date(currentStart);
            dayEnd.setUTCHours(23, 59, 59, 999);
            
            const minutesUntilEndOfDay = Math.floor(
            (dayEnd.getTime() - currentStart.getTime()) / 60000
            ) + 1;

            const partDuration = Math.min(minutesUntilEndOfDay, remainingMinutes);
            
            const partDate = currentStart.toISOString().split('T')[0];
            const partTime = `${String(currentStart.getUTCHours()).padStart(2, '0')}:${String(currentStart.getUTCMinutes()).padStart(2, '0')}`;
            
            const part: Task = {
            ...task,
            startDate: partDate,
            startTime: partTime,
            durationMinutes: partDuration,
            isSplitTask: true,
            parentTaskId: task.id,
            splitIndex: partIndex,
            realDate: partDate,
            };

            console.log(`Part ${partIndex}:`, {
            date: partDate,
            time: partTime,
            duration: partDuration,
            realDate: part.realDate,
            utcHours: currentStart.getUTCHours(),
            utcMinutes: currentStart.getUTCMinutes()
            });

            parts.push(part);
            
            const nextDay = new Date(currentStart);
            nextDay.setUTCDate(nextDay.getUTCDate() + 1);
            nextDay.setUTCHours(0, 0, 0, 0);
            
            currentStart = nextDay;
            remainingMinutes -= partDuration;
            partIndex++;
        }

        console.log('Final parts:', parts.map(p => ({
            date: p.realDate,
            time: p.startTime,
            duration: p.durationMinutes
        })));

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