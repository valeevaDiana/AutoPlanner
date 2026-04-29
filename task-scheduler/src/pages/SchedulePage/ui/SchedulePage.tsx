import React, { useState, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ScheduleCalendar } from "./ScheduleCalendar";
import { TaskFormModal } from "../../../features/task-form/ui/TaskFormModal";
import { PenaltyTasksModal } from "../../../features/penalty-tasks/ui/PenaltyTasksModal";
import { ThemeSelector } from "../../../features/theme-selector/ui/ThemeSelector";
import { useTheme } from "../../../shared/lib/contexts";
import type { Task } from "../../../entities/task/model/types";
import type { PenaltyTask } from "../../../shared/api/types";
import { useTasks } from "../../../shared/lib/hooks/useTasks";
import { taskApi } from "../../../shared/api/taskApi";
import { TelegramConnectionModal } from "../../../features/telegram-connection/ui/TelegramConnectionModal";
import { useTaskSplitter } from "../../../shared/lib/hooks/useTaskSplitter";
//import { AuthModal } from '../../../features/auth/ui/AuthModal';
import { getContrastColor } from "../../../shared/lib/utils/priorityGradient";
import { TagFilter } from "../../../features/tag-filter/ui/TagFilter";
import { tagApi } from "../../../shared/api/tagApi";
import {
  TaskFilterPanel,
  type TaskFilters,
  PriorityFilterType,
} from "../../../features/task-filter/ui/TaskFilterPanel";
import { MonthCalendar } from "./MonthCalendar";

export const SchedulePage: React.FC = () => {
  const {
    tasks,
    penaltyTasks,
    isLoading,
    isLoadingPenalty,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    completeRepitTask,
    getTaskById,
    refetchPenaltyTasks,
    isCreating,
    isUpdating,
    isDeleting,
  } = useTasks();

  const { currentTheme } = useTheme();
  const { getOriginalTaskFromPart } = useTaskSplitter();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskFormMode, setTaskFormMode] = useState<"create" | "edit" | "view">(
    "create",
  );
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [initialDate, setInitialDate] = useState<
    { day: number; time: string; date: string } | undefined
  >();
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [isLoadingTask, setIsLoadingTask] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [isPenaltyModalOpen, setIsPenaltyModalOpen] = useState(false);
  const [filterTagIds, setFilterTagIds] = useState<string[]>([]);
  const [tagsRefreshTrigger, setTagsRefreshTrigger] = useState(0);
  const [calendarView, setCalendarView] = useState<"week" | "month">("week");
  const [taskFilters, setTaskFilters] = useState<TaskFilters>({
    tagIds: [],
    priorityFilterType: "none",
    priorityValue: 5,
    priorityMin: 1,
    priorityMax: 10,
  });

  useEffect(() => {
    if (isTaskFormOpen) {
      loadAvailableTasks();
    }
  }, [isTaskFormOpen]);

  useEffect(() => {
    const existingTags = tagApi.getTags().map((t) => t.id);
    const validFilterIds = filterTagIds.filter((id) =>
      existingTags.includes(id),
    );

    if (validFilterIds.length !== filterTagIds.length) {
      setFilterTagIds(validFilterIds);
    }
  }, [tasks]);

  useEffect(() => {
    const handleTagsUpdate = () => {
      setTagsRefreshTrigger((prev) => prev + 1);
    };

    window.addEventListener("storage", (e) => {
      if (e.key === "autoplanner_tags") {
        handleTagsUpdate();
      }
    });

    return () => {
      window.removeEventListener("storage", handleTagsUpdate);
    };
  }, []);

  const loadAvailableTasks = async () => {
    try {
      const tasks = await taskApi.getAvailableTasks();
      setAvailableTasks(tasks);
    } catch (error) {
      console.error("Failed to load available tasks:", error);
      setAvailableTasks([]);
    }
  };

  const filterTasks = (tasks: Task[], filters: TaskFilters): Task[] => {
    let filtered = [...tasks];
    //по тегам
    if (filters.tagIds.length > 0) {
      filtered = filtered.filter((task) => {
        if (!task.tagIds || task.tagIds.length === 0) return false;
        return task.tagIds.some((tagId) => filters.tagIds.includes(tagId));
      });
    }
    //по приоритету
    if (filters.priorityFilterType !== "none") {
      filtered = filtered.filter((task) => {
        const priority = task.priority;

        switch (filters.priorityFilterType) {
          case "exact":
            return priority === filters.priorityValue;
          case "above":
            return priority > filters.priorityValue;
          case "below":
            return priority < filters.priorityValue;
          case "range":
            return (
              priority >= filters.priorityMin && priority <= filters.priorityMax
            );
          default:
            return true;
        }
      });
    }
    return filtered;
  };

  const filteredTasks = useMemo(() => {
    return filterTasks(tasks, taskFilters);
  }, [tasks, taskFilters]);

  const loadTaskById = async (taskId: string): Promise<Task | null> => {
    try {
      setIsLoadingTask(true);
      const task = await taskApi.getTaskById(taskId);
      return task;
    } catch (error) {
      console.error("Failed to load task:", error);
      return null;
    } finally {
      setIsLoadingTask(false);
    }
  };

  const handleToggleView = () => {
    setCalendarView((prev) => (prev === "week" ? "month" : "week"));
  };

  const handlePenaltyTasksClick = () => {
    setIsPenaltyModalOpen(true);
  };

  const queryClient = useQueryClient();

  const handlePenaltyTasksUpdate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    await queryClient.invalidateQueries({ queryKey: ["penaltyTasks"] });
    await taskApi.rebuildTimeTable();
  };

  const handleAddTaskClick = () => {
    setTaskFormMode("create");
    setEditingTask(null);
    setInitialDate(undefined);
    setIsTaskFormOpen(true);
  };

  const handleCellAddTask = (initialDate?: {
    day: number;
    time: string;
    date: string;
  }) => {
    setTaskFormMode("create");
    setEditingTask(null);
    setInitialDate(initialDate);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = async (task: Task) => {
    const taskFrom = await getTaskById.mutateAsync(task.id);
    if (taskFrom) {
      setTaskFormMode("edit");
      setEditingTask(taskFrom);
      setIsTaskFormOpen(true);
    }
  };

  const handleViewTask = async (task: Task) => {
    const taskFrom = await getTaskById.mutateAsync(task.id);
    if (taskFrom) {
      setTaskFormMode("view");
      setEditingTask(taskFrom);
      setIsTaskFormOpen(true);
    }
  };

  const handleSwitchToEdit = () => {
    setTaskFormMode("edit");
  };

  const handleDeleteTask = async (task: Task) => {
    const taskToDelete = getOriginalTaskFromPart(task, tasks) || task;
    await deleteTask(taskToDelete.id);
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    if (taskData.id) {
      await updateTask(taskData);
    } else {
      await createTask(taskData);
    }
    setIsTaskFormOpen(false);
  };

  const handleTasksUpdate = async (updatedTasks: Task[]) => {
    console.log("Tasks updated locally:", updatedTasks);
  };

  const handleTaskComplete = async (task: Task) => {
    const taskFrom = await getTaskById.mutateAsync(task.id);
    if (taskFrom) {
      console.log(
        "alo",
        taskFrom.title,
        taskFrom.isRepeating,
        taskFrom.id,
        taskFrom.countFrom,
      );
      if (taskFrom.isRepeating) {
        await completeRepitTask({
          taskId: taskFrom.id,
          countFrom: task.countFrom,
        });
      } else {
        console.log("handleTaskComplete called for task:", task.id);
        try {
          await completeTask(task.id);
        } catch (error) {
          console.error("Failed to complete task:", error);
        }
      }
    }
  };

  const getPenaltyButtonFontSize = (count: number): string => {
    if (count >= 10000) return "12px";
    if (count >= 1000) return "14px";
    if (count >= 100) return "16px";
    if (count >= 10) return "18px";
    return "20px";
  };

  if (isLoading) return <div>Загрузка задач...</div>;

  return (
    <div className="page-container">
      <div className="header-fixed">
        <div
          className="header-top-row"
          style={{
            backgroundColor: currentTheme.colors.background,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ThemeSelector />
            <div style={{ position: "relative" }}>
              <TaskFilterPanel
                filters={taskFilters}
                onChange={setTaskFilters}
                triggerButton={
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      backgroundColor:
                        taskFilters.tagIds.length > 0 ||
                        taskFilters.priorityFilterType !== "none"
                          ? currentTheme.colors.primary + "20"
                          : currentTheme.colors.background,
                      border: `1px solid ${currentTheme.colors.border}`,
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                      color: currentTheme.colors.text,
                    }}
                  >
                    <span>Фильтры</span>
                    {(taskFilters.tagIds.length > 0 ||
                      taskFilters.priorityFilterType !== "none") && (
                      <span
                        style={{
                          backgroundColor: currentTheme.colors.primary,
                          color: "white",
                          borderRadius: "10px",
                          padding: "2px 6px",
                          fontSize: "11px",
                        }}
                      >
                        {taskFilters.tagIds.length +
                          (taskFilters.priorityFilterType !== "none" ? 1 : 0)}
                      </span>
                    )}
                  </button>
                }
              />
            </div>
            {/* <div
              className="notification-icon"
              onClick={() => setIsTelegramModalOpen(true)}
              style={{ cursor: "pointer" }}
            >
              🔔
            </div> */}
          </div>

          {/* Кнопка выхода
          <button
            onClick={() => {
              localStorage.removeItem('currentUserId');
              setCurrentUserId(null);
              setIsAuthModalOpen(true);
            }}
            style={{
              backgroundColor: currentTheme.colors.error,
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
            }}
          >
            Выйти
          </button> */}
        </div>

        {/* Вторая строка: заголовок и штрафные задачи */}
        <div
          className="header-bottom-row"
          style={{
            backgroundColor: currentTheme.colors.background,
          }}
        >
          <div className="header-title-wrapper">
            <div className="header-title">План на</div>
            <button
              className="week-selector"
              onClick={handleToggleView}
              style={{
                background: currentTheme.colors.primary,
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "18px",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {calendarView === "week" ? "Неделя" : "Месяц"}
            </button>

            <button
              onClick={handlePenaltyTasksClick}
              style={{
                backgroundColor: currentTheme.colors.error,
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: getPenaltyButtonFontSize(penaltyTasks.length),
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                minWidth: "30px",
                justifyContent: "center",
                marginLeft: "5px",
              }}
            >
              🚫{penaltyTasks.length}
            </button>
          </div>
        </div>
      </div>

      <div className="content-wrapper">
        {calendarView === "week" ? (
          <ScheduleCalendar
            onAddTask={handleCellAddTask}
            onEditTask={handleEditTask}
            onViewTask={handleViewTask}
            onDeleteTask={handleDeleteTask}
            onCompleteTask={handleTaskComplete}
            tasks={filteredTasks}
            onTasksUpdate={handleTasksUpdate}
          />
        ) : (
          <MonthCalendar
            onAddTask={handleCellAddTask}
            onEditTask={handleEditTask}
            onViewTask={handleViewTask}
            onDeleteTask={handleDeleteTask}
            onCompleteTask={handleTaskComplete}
            tasks={filteredTasks}
          />
        )}
      </div>

      <div className="footer-fixed">
        <button
          className="add-button"
          onClick={handleAddTaskClick}
          disabled={isCreating}
        >
          {isCreating ? "Создание..." : "Добавить задачу"}
        </button>
      </div>

      <TaskFormModal
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSave={handleSaveTask}
        onEdit={handleSwitchToEdit}
        task={editingTask}
        mode={taskFormMode}
        initialDate={initialDate}
        isSaving={isCreating || isUpdating || isLoadingTask}
        availableTasks={availableTasks}
      />

      <PenaltyTasksModal
        isOpen={isPenaltyModalOpen}
        onClose={() => setIsPenaltyModalOpen(false)}
        penaltyTasks={penaltyTasks}
        onTasksUpdate={handlePenaltyTasksUpdate}
      />

      <TelegramConnectionModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
      />
    </div>
  );
};
