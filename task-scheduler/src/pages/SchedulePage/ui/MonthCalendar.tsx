import React, { useState, useMemo, useRef, useEffect } from "react";
import type { Task, TaskAction } from "../../../entities/task/model/types";
import { TaskActionsModal } from "../../../features/task-actions/ui/TaskActionsModal";
import { ConfirmDeleteModal } from "../../../features/task-actions/ui/ConfirmDeleteModal";
import { useTheme } from "../../../shared/lib/contexts";
import {
  getContrastColor,
  getPriorityColor,
} from "../../../shared/lib/utils/priorityGradient";
import { useTaskSplitter } from "../../../shared/lib/hooks/useTaskSplitter";

const WEEKDAYS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

interface MonthCalendarProps {
  onAddTask?: (initialDate?: {
    day: number;
    time: string;
    date: string;
  }) => void;
  onEditTask?: (task: Task) => void;
  onViewTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void;
  onCompleteTask?: (task: Task) => void;
  tasks: Task[];
}

interface TaskCell {
  task: Task;
  isStartDay: boolean;
  isEndDay: boolean;
  displayTime: string;
}

const getMonthDates = (currentDate: Date) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  let startWeekday = firstDayOfMonth.getDay();
  startWeekday = startWeekday === 0 ? 6 : startWeekday - 1;

  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(firstDayOfMonth.getDate() - startWeekday);

  const daysCount = Math.ceil(
    (lastDayOfMonth.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const weeksCount = Math.ceil(daysCount / 7);

  const weeks: Date[][] = [];
  for (let week = 0; week < weeksCount; week++) {
    const weekDays: Date[] = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + week * 7 + day);
      weekDays.push(date);
    }
    weeks.push(weekDays);
  }

  return { weeks, month };
};

const getTasksForDay = (
  date: Date,
  tasks: Task[],
  displayTasks: Task[],
): TaskCell[] => {
  const dateString = date.toISOString().split("T")[0];
  const dayTasks = displayTasks.filter((task) => {
    const taskRealDate = task.realDate || task.startDate || "";
    return taskRealDate === dateString;
  });

  return dayTasks
    .sort((a, b) => {
      const timeA = a.startTime || "00:00";
      const timeB = b.startTime || "00:00";
      return timeA.localeCompare(timeB);
    })
    .map((task) => {
      const taskStartDate = task.startDate;
      const taskEndDate = task.endDate;
      const isStartDay = taskStartDate === dateString;
      const isEndDay = taskEndDate === dateString;

      let displayTime = task.startTime || "";
      if (!isStartDay && isEndDay) {
        displayTime = `до ${task.endTime || ""}`;
      } else if (!isStartDay && !isEndDay && task.isSplitTask) {
        displayTime = "весь день";
      }

      return { task, isStartDay, isEndDay, displayTime };
    });
};

// Компонент ячейки задачи
const TaskCellItem: React.FC<{
  taskCell: TaskCell;
  onTaskClick: (task: Task, event: React.MouseEvent) => void;
}> = ({ taskCell, onTaskClick }) => {
  const { currentTheme } = useTheme();
  const { task, isStartDay, isEndDay, displayTime } = taskCell;

  const backgroundColor = getPriorityColor(
    task.priority,
    currentTheme.colors.priorityLow,
    currentTheme.colors.priorityHigh,
  );
  const textColor = getContrastColor(backgroundColor);
  const isCompleted = task.completed;

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onTaskClick(task, event);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        padding: "6px 8px",
        marginBottom: "4px",
        borderRadius: "4px",
        backgroundColor: isCompleted
          ? currentTheme.colors.priorityCompleted
          : backgroundColor,
        color: isCompleted
          ? currentTheme.colors.priorityCompletedText
          : textColor,
        fontSize: "11px",
        cursor: "pointer",
        position: "relative",
        borderLeft: isStartDay
          ? `3px solid ${currentTheme.colors.textSecondary}`
          : "none",
        borderRight: isEndDay
          ? `3px solid ${currentTheme.colors.textSecondary}`
          : "none",
        opacity: isCompleted ? 0.7 : 0.95,
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.02)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <div
        style={{
          textDecoration: isCompleted ? "line-through" : "none",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {displayTime && (
          <span style={{ fontWeight: "bold", marginRight: "4px" }}>
            {displayTime}
          </span>
        )}
        {task.title}
      </div>
    </div>
  );
};

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
  onAddTask,
  onEditTask,
  onViewTask,
  onDeleteTask,
  onCompleteTask,
  tasks,
}) => {
  const { currentTheme } = useTheme();
  const { splitAllTasks } = useTaskSplitter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalPosition, setDeleteModalPosition] = useState({
    top: 0,
    left: 0,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const displayTasks = useMemo(
    () => splitAllTasks(tasks),
    [tasks, splitAllTasks],
  );
  const { weeks, month } = useMemo(
    () => getMonthDates(currentMonth),
    [currentMonth],
  );
  const goToPrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const formatMonthYear = () => {
    const months = [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ];
    return `${months[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
  };

  const handleCellClick = (date: Date) => {
    if (onAddTask) {
      onAddTask({
        day: date.getDay(),
        time: "09:00",
        date: date.toISOString().split("T")[0],
      });
    }
  };

  const handleTaskClick = (task: Task, event: React.MouseEvent) => {
    setSelectedTask(task);
    setModalPosition({ top: event.clientY, left: event.clientX });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleTaskAction = (action: TaskAction) => {
    if (!selectedTask) return;
    if (action === "complete" && onCompleteTask) {
      onCompleteTask(selectedTask);
    }
  };

  const handleDirectEdit = (task: Task) => {
    if (onEditTask) onEditTask(task);
  };

  const handleTaskDelete = (task: Task) => {
    setTaskToDelete(task);
    setDeleteModalPosition(modalPosition);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (task: Task) => {
    if (onDeleteTask) onDeleteTask(task);
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month;
  };

  const minTableWidth = "1050px";
  const gridTemplateColumns = "repeat(7, minmax(150px, 1fr))";

  return (
    <div
      className="calendar-container"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      {/* Навигация */}
      <div
        className="calendar-navigation"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 15px",
          backgroundColor: currentTheme.colors.calendarNavigation,
          borderBottom: `1px solid ${currentTheme.colors.border}`,
          flexShrink: 0,
        }}
      >
        <button
          onClick={goToPrevMonth}
          style={{
            padding: "8px 16px",
            backgroundColor: currentTheme.colors.primary,
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
          ←
        </button>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: currentTheme.colors.text,
            }}
          >
            {formatMonthYear()}
          </div>
          <button
            onClick={goToToday}
            style={{
              marginTop: "5px",
              padding: "4px 12px",
              backgroundColor: "transparent",
              color: currentTheme.colors.primary,
              border: `1px solid ${currentTheme.colors.primary}`,
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Сегодня
          </button>
        </div>

        <button
          onClick={goToNextMonth}
          style={{
            padding: "8px 16px",
            backgroundColor: currentTheme.colors.primary,
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
          →
        </button>
      </div>

      <div
        ref={scrollContainerRef}
        style={{
          flex: 1,
          overflow: "auto",
        }}
      >
        {/* Внутренний контейнер */}
        <div style={{ minWidth: minTableWidth }}>
          {/* Заголовки дней недели */}
          <div
            className="month-calendar-header"
            style={{
              display: "grid",
              gridTemplateColumns: gridTemplateColumns,
              backgroundColor: currentTheme.colors.calendarHeader,
              borderBottom: `1px solid ${currentTheme.colors.border}`,
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                style={{
                  padding: "12px",
                  textAlign: "center",
                  fontWeight: "600",
                  color: currentTheme.colors.text,
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Ячейки календаря */}
          {weeks.map((week, weekIndex) => (
            <div
              key={weekIndex}
              className="month-calendar-week"
              style={{
                display: "grid",
                gridTemplateColumns: gridTemplateColumns,
                minHeight: "120px",
              }}
            >
              {week.map((date, dayIndex) => {
                const tasksForDay = getTasksForDay(date, tasks, displayTasks);
                const isCurrentMonthDay = isCurrentMonth(date);
                const isTodayDay = isToday(date);

                return (
                  <div
                    key={dayIndex}
                    onClick={() => handleCellClick(date)}
                    style={{
                      border: isTodayDay
                        ? `3px solid ${currentTheme.colors.error}`
                        : `1px solid ${currentTheme.colors.border}`,
                      padding: "8px",
                      minHeight: "120px",
                      backgroundColor: isCurrentMonthDay
                        ? currentTheme.colors.background
                        : currentTheme.colors.surface,
                      cursor: "pointer",
                      verticalAlign: "top",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: isTodayDay ? "bold" : "normal",
                        color: isTodayDay
                          ? currentTheme.colors.primary
                          : currentTheme.colors.text,
                        marginBottom: "8px",
                        textAlign: "right",
                      }}
                    >
                      {date.getDate()}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                        maxHeight: "calc(100% - 30px)",
                      }}
                    >
                      {tasksForDay.map((taskCell, idx) => (
                        <TaskCellItem
                          key={`${taskCell.task.id}_${idx}`}
                          taskCell={taskCell}
                          onTaskClick={handleTaskClick}
                        />
                      ))}
                    </div>

                    {/* Кнопка добавления задачи */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "4px",
                        right: "4px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        backgroundColor: currentTheme.colors.primary,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        cursor: "pointer",
                        opacity: 0.5,
                        transition: "opacity 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "1";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "0.5";
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCellClick(date);
                      }}
                    >
                      +
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Модальные окна */}
      {selectedTask && (
        <TaskActionsModal
          task={selectedTask}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onAction={handleTaskAction}
          onEdit={handleDirectEdit}
          onDelete={handleTaskDelete}
          onComplete={onCompleteTask}
          onViewTask={onViewTask}
          position={modalPosition}
        />
      )}

      {taskToDelete && (
        <ConfirmDeleteModal
          task={taskToDelete}
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          position={deleteModalPosition}
        />
      )}
    </div>
  );
};
