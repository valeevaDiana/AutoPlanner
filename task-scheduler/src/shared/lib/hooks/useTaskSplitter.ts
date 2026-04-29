import { useMemo } from "react";
import type { Task } from "../../../entities/task/model/types";

export const useTaskSplitter = () => {
  const splitTaskByDays = (task: Task): Task[] => {
    if (!task.startDate || !task.startTime) {
      return [task];
    }

    const partss = task.duration.split(":");

    let day = 0;
    let hour = 0;
    let minute = 0;
    if (partss.length === 4) {
      // Формат: дни:часы:минуты:секунды
      const [days, hours, minutes, seconds] = partss;
      day = parseInt(days);
      hour = parseInt(hours);
      minute = parseInt(minutes);
    } else if (partss.length === 3) {
      // Формат: дни:часы:минуты
      const [hours, minutes, seconds] = partss;
      hour = parseInt(hours);
      minute = parseInt(minutes);
    }
    let dur = day * 24 * 60 + hour * 60 + minute;

    if (dur == 0) {
      const startDateTime: Date = new Date(
        `${task.startDate}T${task.startTime}`,
      );
      const endDateTime: Date = new Date(`${task.endDate}T${task.endTime}`);

      // Расчет длительности в минутах
      const durationMs: number =
        endDateTime.getTime() - startDateTime.getTime();
      dur = Math.floor(durationMs / (1000 * 60));
    }

    const [startHours, startMinutes] = task.startTime.split(":").map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = startTotalMinutes + dur;

    if (
      Math.floor(endTotalMinutes / (24 * 60)) ===
      Math.floor(startTotalMinutes / (24 * 60))
    ) {
      return [task];
    }

    const parts: Task[] = [];
    let currentDate = task.startDate;
    let remainingMinutes = dur;
    let currentStartMinutes = startTotalMinutes;
    let partIndex = 0;

    while (remainingMinutes > 0 && partIndex < 10) {
      const minutesUntilEndOfDay = 24 * 60 - currentStartMinutes;
      const partDuration = Math.min(minutesUntilEndOfDay, remainingMinutes);

      const partHours = Math.floor(currentStartMinutes / 60);
      const partMinutes = currentStartMinutes % 60;
      const partTime = `${String(partHours).padStart(2, "0")}:${String(partMinutes).padStart(2, "0")}`;

      const minutesInDay = 24 * 60; // 1440 минут в дне
      const minutesInHour = 60; // 60 минут в часе

      const days = Math.floor(partDuration / minutesInDay);
      const remainingMinutesAfterDays = partDuration % minutesInDay;

      const hours = Math.floor(remainingMinutesAfterDays / minutesInHour);
      const minutes = remainingMinutesAfterDays % minutesInHour;

      const part: Task = {
        ...task,
        startDate: currentDate,
        startTime: partTime,
        duration: `${days}:${hours}:${minutes}:00`,
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
      const month = String(nextDate.getMonth() + 1).padStart(2, "0");
      const day = String(nextDate.getDate()).padStart(2, "0");
      currentDate = `${year}-${month}-${day}`;

      currentStartMinutes = 0;
      remainingMinutes -= partDuration;
      partIndex++;
    }

    return parts;
  };

  const splitAllTasks = (tasks: Task[]): Task[] => {
    return tasks.flatMap((task) => {
      if (task.isSplitTask) return [task];
      return splitTaskByDays(task);
    });
  };

  const getOriginalTaskFromPart = (
    taskPart: Task,
    allTasks: Task[],
  ): Task | null => {
    if (!taskPart.isSplitTask) return taskPart;

    const originalTask = allTasks.find(
      (t) => t.id === taskPart.parentTaskId && !t.isSplitTask,
    );
    return originalTask || taskPart;
  };

  const getAllTaskParts = (task: Task, allTasks: Task[]): Task[] => {
    if (!task.isSplitTask) {
      return allTasks.filter(
        (t) => t.parentTaskId === task.id || t.id === task.id,
      );
    } else {
      return allTasks.filter((t) => t.parentTaskId === task.parentTaskId);
    }
  };

  return {
    splitTaskByDays,
    splitAllTasks,
    getOriginalTaskFromPart,
    getAllTaskParts,
  };
};
