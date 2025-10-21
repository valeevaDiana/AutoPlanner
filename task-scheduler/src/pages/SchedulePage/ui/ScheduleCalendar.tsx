import React from 'react';
import type { Task, TaskAction } from '../../../entities/task/model/types';
import { TaskActionsModal } from '../../../features/task-actions/ui/TaskActionsModal';
import { useWeekNavigation } from '../../../shared/lib/hooks/useWeekNavigation';

import { CalendarNavigation } from './CalendarNavigation';
import { CalendarHeader } from './CalendarHeader';
import { CalendarBody } from './CalendarBody';

import { useCalendar } from './Calendar.hooks';

interface ScheduleCalendarProps {
  onAddTask?: (initialDate?: { day: number; time: string; date: string }) => void;
  onEditTask?: (task: Task) => void;
  onViewTask?: (task: Task) => void;
  tasks: Task[];
  onTasksUpdate?: (tasks: Task[]) => void;
}

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  onAddTask,
  onEditTask,
  onViewTask,
  tasks,
  onTasksUpdate
}) => {
  const { getISODate } = useWeekNavigation();
  
  const {
    selectedTask,
    modalPosition,
    isModalOpen,
    handleTaskClick,
    handleModalClose,
    handleTaskAction
  } = useCalendar(tasks, onTasksUpdate);

  const handleEmptyCellClick = (dayIndex: number, time: string, date: Date) => {
    if (onAddTask) {
      onAddTask({
        day: dayIndex,
        time: time,
        date: getISODate(date)
      });
    }
  };

  const handleDirectEdit = (task: Task) => {
    if (onEditTask) {
      onEditTask(task);
    }
  };

  return (
    <div className="calendar-container">
      <CalendarNavigation />
      <div className="calendar-scroll-container">
        <CalendarHeader />
        <CalendarBody
          tasks={tasks}
          onTaskClick={handleTaskClick}
          onEmptyCellClick={handleEmptyCellClick}
        />
      </div>
      {selectedTask && (
        <TaskActionsModal
          task={selectedTask}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onAction={handleTaskAction}
          onEdit={handleDirectEdit}
          position={modalPosition}
        />
      )}
    </div>
  );
};