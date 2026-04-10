import type { Task } from "../../entities/task/model/types";
import type { ApiTask, ApiTimeTableResponse, PenaltyTask } from "./types";
import type { Tag } from "../../entities/tag/model/types";

const preserveTagsFromOldTasks = (
  newTasks: Task[],
  oldTasks: Task[],
): Task[] => {
  const oldTasksMap = new Map(oldTasks.map((t) => [t.id, t]));
  return newTasks.map((task) => {
    const oldTask = oldTasksMap.get(task.id);
    if (oldTask?.tagIds) {
      task.tagIds = oldTask.tagIds;
    }
    return task;
  });
};

const API_BASE_URL = "/api";
const STORAGE_KEY = "autoplanner_tasks";
const STORAGE_KEY_PENALTY = "autoplanner_penalty_tasks";
const STORAGE_KEY_TASK_TAGS = "autoplanner_task_tags";
const STORAGE_KEY_TAGS = "autoplanner_tags";

export const taskTagStorage = {
  getTaskTags: (taskId: string): string[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_TASK_TAGS);
      const allTags = data ? JSON.parse(data) : {};
      return allTags[taskId] || [];
    } catch {
      return [];
    }
  },

  setTaskTags: (taskId: string, tagIds: string[]): void => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_TASK_TAGS);
      const allTags = data ? JSON.parse(data) : {};
      allTags[taskId] = tagIds;
      localStorage.setItem(STORAGE_KEY_TASK_TAGS, JSON.stringify(allTags));
    } catch (error) {
      console.error("Error saving task tags:", error);
    }
  },

  removeTaskTags: (taskId: string): void => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_TASK_TAGS);
      const allTags = data ? JSON.parse(data) : {};
      delete allTags[taskId];
      localStorage.setItem(STORAGE_KEY_TASK_TAGS, JSON.stringify(allTags));
    } catch (error) {
      console.error("Error removing task tags:", error);
    }
  },

  getAllTaskTags: (): Record<string, string[]> => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_TASK_TAGS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  restoreTagsToTasks: (tasks: Task[]): Task[] => {
    const allTags = taskTagStorage.getAllTaskTags();
    return tasks.map((task) => ({
      ...task,
      tagIds: allTags[task.id] || [],
    }));
  },
};

export const tagApi = {
  getTags: (): Tag[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_TAGS);
      if (data) {
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error("Error reading tags from localStorage:", error);
      return [];
    }
  },

  saveTags: (tags: Tag[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY_TAGS, JSON.stringify(tags));
      window.dispatchEvent(new CustomEvent("tags-updated"));
    } catch (error) {
      console.error("Error saving tags to localStorage:", error);
    }
  },

  addTag: (tagName: string, color?: string): Tag => {
    const tags = tagApi.getTags();
    const newTag: Tag = {
      id: Date.now().toString(),
      name: tagName.trim(),
      color: color || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      createdAt: new Date().toISOString(),
    };
    tags.push(newTag);
    tagApi.saveTags(tags);
    return newTag;
  },

  updateTag: (id: string, updates: Partial<Omit<Tag, "id" | "createdAt">>): Tag | null => {
    const tags = tagApi.getTags();
    const index = tags.findIndex((t) => t.id === id);
    if (index !== -1) {
      tags[index] = { ...tags[index], ...updates };
      tagApi.saveTags(tags);
      return tags[index];
    }
    return null;
  },

  deleteTag: (id: string): boolean => {
    const tags = tagApi.getTags();
    const filtered = tags.filter((t) => t.id !== id);
    if (filtered.length !== tags.length) {
      tagApi.saveTags(filtered);
      return true;
    }
    return false;
  },

  getTagById: (id: string): Tag | undefined => {
    const tags = tagApi.getTags();
    return tags.find((t) => t.id === id);
  },
};

//локальные функции
export const localStorageApi = {
  getTasks: (): Task[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading tasks from localStorage:", error);
      return [];
    }
  },

  saveTasks: (tasks: Task[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error);
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
  },
};

const formatToISO = (date: string, time: string = "00:00"): string => {
  if (!date) return "";
  return `${date}T${time}:00`;
};

const getWeekRange = () => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay() + 1 - 14);
  const end = new Date(now);
  end.setDate(now.getDate() - now.getDay() + 1 + 14);

  const toISOString = (date: Date) =>
    date.toISOString().replace(/\.\d{3}Z$/, "");
  return {
    startTimeTable: toISOString(start),
    endDateTime: toISOString(end),
  };
};

const taskToFormData = (
  taskData: Partial<Task>,
  isUpdate = false,
): FormData => {
  const formData = new FormData();

  if (isUpdate && taskData.id) {
    formData.append("Id", taskData.id);
  }

  formData.append("Name", taskData.title || "Без названия");
  const descriptionValue =
    taskData.description?.trim() === " " ? "-" : taskData.description || "-";
  formData.append("Description", descriptionValue);
  formData.append("Priority", String(taskData.priority ?? 5));

  if (taskData.startDate && taskData.startTime) {
    formData.append(
      "StartDateTime",
      `${taskData.startDate}T${taskData.startTime}:00`,
    );
  } else {
    formData.append("StartDateTime", "");
  }

  if (taskData.endDate && taskData.endTime) {
    formData.append(
      "EndDateTime",
      `${taskData.endDate}T${taskData.endTime}:00`,
    );
  } else {
    formData.append("EndDateTime", "");
  }

  if (taskData.duration) {
    const l = taskData.duration
      .split(":")
      .map((part) => part.padStart(2, "0"))
      .join(":")
      .padEnd(11, ":00")
      .slice(0, 11);
    formData.append("Duration", l);
  }

  if (taskData.repeateDurationMinute) {
    formData.append("RepitTime", taskData.repeateDurationMinute);
  }

  formData.append("IsRepitFromStart", "false");
  formData.append("IsRepit", String(Boolean(taskData.isRepeating)));
  formData.append("CountRepit", String(taskData.repeatCount || 0));

  if (taskData.startDateTimeRepit) {
    formData.append("StartDateTimeRepit", taskData.startDateTimeRepit);
  }

  if (taskData.endDateTimeRepit) {
    formData.append("EndDateTimeRepit", taskData.endDateTimeRepit);
  }

  formData.append("RuleOneTask", String(Boolean(taskData.ruleOneTask)));

  if (taskData.ruleOneTask && taskData.startDateTimeRuleOneTask) {
    formData.append(
      "StartDateTimeRuleOneTask",
      taskData.startDateTimeRuleOneTask,
    );
  }

  if (taskData.ruleOneTask && taskData.endDateTimeRuleOneTask) {
    formData.append("EndDateTimeRuleOneTask", taskData.endDateTimeRuleOneTask);
  }

  if (isUpdate) {
    formData.append("IsComplete", String(Boolean(taskData.completed)));
    if (taskData.completed) {
      formData.append("CompleteDateTime", new Date().toISOString());
    }
  }

  formData.append("RuleTwoTask", String(Boolean(taskData.ruleTwoTask)));

  if (taskData.ruleTwoTask) {
    if (taskData.secondTaskId !== undefined) {
      formData.append("SecondTaskId", String(taskData.secondTaskId));
    }
    if (taskData.timePositionRegardingTaskId !== undefined) {
      formData.append(
        "TimePositionRegardingTaskId",
        String(taskData.timePositionRegardingTaskId),
      );
    }
    if (taskData.relationRangeId !== undefined) {
      formData.append("RelationRangeId", String(taskData.relationRangeId));
    }
    if (taskData.dateTimeRange) {
      formData.append("DateTimeRange", taskData.dateTimeRange);
    }
  }

  return formData;
};

const taskToPlanningFormat = (task: Task) => ({
  Name: task.title || "",
  Description: task.description || "",
  Priority: task.priority,
  StartDateTime:
    task.startDate && task.startTime
      ? `${task.startDate}T${task.startTime}:00`
      : null,
  EndDateTime:
    task.endDate && task.endTime ? `${task.endDate}T${task.endTime}:00` : null,

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

  DateTimeRangeString: task.dateTimeRange || null,
});

const apiTaskToTask = (apiTask: ApiTask): Task => {
  const parseDate = (
    isoString: string | null | undefined,
  ): { date?: string; time?: string } => {
    if (!isoString) return {};
    try {
      const [datePart, timePart] = isoString.split("T");
      if (!datePart || !timePart) return {};
      const time = timePart.substring(0, 5);
      return { date: datePart, time: time };
    } catch (error) {
      console.error("Error parsing date:", isoString, error);
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
      const month = String(endDate.getMonth() + 1).padStart(2, "0");
      const day = String(endDate.getDate()).padStart(2, "0");
      const endHours = String(endDate.getHours()).padStart(2, "0");
      const endMinutes = String(endDate.getMinutes()).padStart(2, "0");
      end = {
        date: `${year}-${month}-${day}`,
        time: `${endHours}:${endMinutes}`,
      };
    }
  }

  return {
    id: String(apiTask.id ?? apiTask.myTaskId ?? "unknown"),
    title: apiTask.name || "",
    description: apiTask.description || "",
    priority: apiTask.priority || 5,
    startDate: start?.date || undefined,
    startTime: start?.time || undefined,
    endDate: end?.date || undefined,
    endTime: end?.time || undefined,
    duration: apiTask.duration || "",
    completed: Boolean(apiTask.isComplete),
    realDate: start?.date || new Date().toISOString().split("T")[0],
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
    tagIds: apiTask.tagIds,
  };
};

export const taskApi = {
  async getTasks(): Promise<Task[]> {
    const localTasks = localStorageApi.getTasks();

    try {
      const { startTimeTable, endDateTime } = getWeekRange();

      const response = await fetch(
        `${API_BASE_URL}/time-table/recreate-local`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tasks: localTasks.map(taskToPlanningFormat),
            startTimeTable,
            endDateTime,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.timeTableItems) {
          const convertedTasks = data.timeTableItems.map((item: ApiTask) => {
            const task = apiTaskToTask(item);
            task.realDate = item.startDateTime
              ? item.startDateTime.split("T")[0]
              : task.realDate;
            return task;
          });

          const plannedTasks = preserveTagsFromOldTasks(
            convertedTasks,
            localTasks,
          );

          localStorageApi.saveTasks(plannedTasks);
          return plannedTasks;
        }
      }
    } catch (error) {
      console.error("Error planning tasks on backend:", error);
    }

    return localTasks;
  },

  async createTask(taskData: Partial<Task>): Promise<void> {
    const tempId = Date.now().toString();
    let finalTaskId: string | null = null;

    if (taskData.tagIds && taskData.tagIds.length > 0) {
      taskTagStorage.setTaskTags(tempId, taskData.tagIds);
    }

    try {
      const formData = taskToFormData(taskData, false);
      const response = await fetch(`${API_BASE_URL}/task`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const responseText = await response.text();

        if (responseText && !isNaN(Number(responseText))) {
          finalTaskId = responseText;
        } else {
          try {
            const jsonResponse = JSON.parse(responseText);
            if (jsonResponse.id) {
              finalTaskId = String(jsonResponse.id);
            } else if (jsonResponse.taskId) {
              finalTaskId = String(jsonResponse.taskId);
            }
          } catch {
            //
          }
        }

        await this.rebuildTimeTable();

        if (finalTaskId) {
          const savedTags = taskTagStorage.getTaskTags(tempId);
          if (savedTags.length > 0) {
            taskTagStorage.setTaskTags(finalTaskId, savedTags);
            taskTagStorage.removeTaskTags(tempId);

            const updatedTasks = localStorageApi.getTasks();
            const taskToUpdate = updatedTasks.find((t) => t.id === finalTaskId);
            if (taskToUpdate) {
              taskToUpdate.tagIds = savedTags;
              localStorageApi.saveTasks(updatedTasks);
            }
          }
        } else {
          await new Promise((resolve) => setTimeout(resolve, 500));

          const updatedTasks = localStorageApi.getTasks();
          const newTask = updatedTasks.find(
            (t) =>
              t.title === taskData.title &&
              t.startDate === taskData.startDate &&
              t.startTime === taskData.startTime,
          );

          if (newTask && taskData.tagIds && taskData.tagIds.length > 0) {
            taskTagStorage.setTaskTags(newTask.id, taskData.tagIds);
            newTask.tagIds = taskData.tagIds;
            localStorageApi.saveTasks(updatedTasks);
          }
        }
      } else {
        console.error("Backend create failed:", response.status);
      }
    } catch (error) {
      console.warn("Backend save failed:", error);
    }
  },

  async updateTask(taskData: Partial<Task>): Promise<void> {
    if (taskData.id) {
      if (taskData.tagIds !== undefined) {
        if (taskData.tagIds.length > 0) {
          taskTagStorage.setTaskTags(taskData.id, taskData.tagIds);
        } else {
          taskTagStorage.removeTaskTags(taskData.id);
          console.log("Removed all tags for task:", taskData.id);
        }
      }
    }

    const currentTasks = localStorageApi.getTasks();
    const index = currentTasks.findIndex((t) => t.id === taskData.id);

    if (index !== -1) {
      currentTasks[index] = {
        ...currentTasks[index],
        ...taskData,
        realDate: taskData.startDate || currentTasks[index].realDate,
        tagIds:
          taskData.tagIds !== undefined
            ? taskData.tagIds
            : currentTasks[index].tagIds,
      } as Task;
      localStorageApi.saveTasks(currentTasks);
    }

    try {
      const formData = taskToFormData(taskData, true);
      await fetch(`${API_BASE_URL}/task`, {
        method: "PUT",
        body: formData,
      });
    } catch (error) {
      console.error("Error updating task on backend:", error);
    }

    await this.rebuildTimeTable();
  },

  async deleteTask(taskId: string): Promise<void> {
    taskTagStorage.removeTaskTags(taskId);

    const currentTasks = localStorageApi.getTasks();
    const filteredTasks = currentTasks.filter((t) => t.id !== taskId);
    localStorageApi.saveTasks(filteredTasks);

    try {
      await fetch(`${API_BASE_URL}/task/${taskId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting task on backend:", error);
    }

    await this.rebuildTimeTable();
  },

  async completeTask(taskId: string): Promise<void> {
    const currentTasks = localStorageApi.getTasks();
    const index = currentTasks.findIndex((t) => t.id === taskId);

    if (index !== -1) {
      currentTasks[index].completed = true;
      localStorageApi.saveTasks(currentTasks);
    }

    try {
      await fetch(`${API_BASE_URL}/task/complete/${taskId}`, {
        method: "PUT",
      });
    } catch (error) {
      console.error("Error completing task on backend:", error);
    }

    await this.rebuildTimeTable();
  },

  async completeRepitTask(taskId: string, countFrom: number): Promise<void> {
    const currentTasks = localStorageApi.getTasks();
    const index = currentTasks.findIndex((t) => t.id === taskId);

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
        method: "PUT",
      });
    } catch (error) {
      console.error("Error completing repit task on backend:", error);
    }

    await this.rebuildTimeTable();
  },

  async rebuildTimeTable(tasksOverride?: Task[]): Promise<void> {
    const currentTasks = tasksOverride || localStorageApi.getTasks();
    if (currentTasks.length === 0) {
      console.warn("[WARN] No tasks to plan!");
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/time-table/recreate-local`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tasks: currentTasks.map(taskToPlanningFormat),
            startTimeTable: new Date(
              Date.now() - 14 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            endDateTime: new Date(
              Date.now() + 14 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error:", response.status, errorText);
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.timeTableItems) {
        const convertedTasks = data.timeTableItems.map((item: ApiTask) => {
          const task = apiTaskToTask(item);
          task.realDate = item.startDateTime
            ? item.startDateTime.split("T")[0]
            : task.realDate;
          return task;
        });

        const tasksWithRestoredTags =
          taskTagStorage.restoreTagsToTasks(convertedTasks);

        console.log(
          "Tags restored after rebuild:",
          tasksWithRestoredTags.map((t) => ({ id: t.id, tagIds: t.tagIds })),
        );

        localStorageApi.saveTasks(tasksWithRestoredTags);
      }

      if (data.penaltyTasks) {
        const penaltyTasksWithTags = data.penaltyTasks.map(
          (penaltyTask: PenaltyTask) => {
            const savedTags = taskTagStorage.getTaskTags(
              String(penaltyTask.myTaskId),
            );
            if (savedTags.length > 0) {
              return { ...penaltyTask, tagIds: savedTags };
            }
            return penaltyTask;
          },
        );

        localStorageApi.savePenaltyTasks(penaltyTasksWithTags);
      }
    } catch (error) {
      console.error("Error rebuilding timetable:", error);
    }
  },

  async getAvailableTasks(): Promise<Task[]> {
    const allTasks = localStorageApi.getTasks();
    return allTasks.filter(
      (task) =>
        task.startDate &&
        task.startDate.trim() !== "" &&
        task.startDate !== "null" &&
        task.startDate !== "undefined" &&
        task.isRepeating === false,
    );
  },

  async getTaskById(taskId: string): Promise<Task | null> {
    const allTasks = localStorageApi.getTasks();
    const task = allTasks.find((t) => t.id === taskId) || null;

    if (task) {
      const savedTags = taskTagStorage.getTaskTags(taskId);
      if (savedTags.length > 0 && (!task.tagIds || task.tagIds.length === 0)) {
        task.tagIds = savedTags;
        console.log("Tags restored in getTaskById:", savedTags);
      }
    }

    return task;
  },

  async getPenaltyTasks(): Promise<PenaltyTask[]> {
    return localStorageApi.getPenaltyTasks();
  },

  async clearAllData(): Promise<void> {
    localStorageApi.clearAll();
  },
};

export const telegramApi = {
  async generateTelegramCode(): Promise<{
    code: string;
    telegramLink: string;
  }> {
    return { code: "", telegramLink: "" };
  },
};