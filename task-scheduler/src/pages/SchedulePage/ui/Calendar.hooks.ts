import { useState } from 'react';
import type { Task } from '../../../entities/task/model/types';

export const useCalendar = (tasks: Task[], onTasksUpdate?: (tasks: Task[]) => void) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTaskClick = (task: Task, event: React.MouseEvent) => {
    setSelectedTask(task);
    setModalPosition({
      top: event.clientY,
      left: event.clientX
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleTaskAction = (action: 'complete' | 'edit') => {
    if (!selectedTask) return;
    
    if (action === 'complete') {
      const updatedTasks = tasks.map(task =>
        task.id === selectedTask.id
          ? { ...task, completed: !task.completed }
          : task
      );
      onTasksUpdate?.(updatedTasks);
    }
  };

  return {
    selectedTask,
    modalPosition,
    isModalOpen,
    handleTaskClick,
    handleModalClose,
    handleTaskAction,
    setSelectedTask,
    setIsModalOpen
  };
};

export const generateTimeSlots = (): string[] => {
  const times: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    const timeStr = `${hour.toString().padStart(2, '0')}:00`;
    times.push(timeStr);
  }
  return times;
};

export const DAYS = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];