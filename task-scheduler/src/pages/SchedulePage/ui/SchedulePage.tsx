import React, { useState } from 'react';
import { ScheduleCalendar } from './ScheduleCalendar';
import { TaskFormModal } from '../../../features/task-form/ui/TaskFormModal';
import { ThemeSelector } from '../../../features/theme-selector/ui/ThemeSelector';
import type { Task } from '../../../entities/task/model/types';
import { useTasks } from '../../../shared/lib/hooks/useTasks';

export const SchedulePage: React.FC = () => {
  const {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    isCreating,
    isUpdating,
    isDeleting,
  } = useTasks();

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskFormMode, setTaskFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [initialDate, setInitialDate] = useState<{ day: number; time: string; date: string } | undefined>();

  const handleToggleView = () => {
    alert("Переключение режима: неделя → день → месяц");
  };

  const handleAddTaskClick = () => {
    setTaskFormMode('create');
    setEditingTask(null);
    setInitialDate(undefined);
    setIsTaskFormOpen(true);
  };

  const handleCellAddTask = (initialDate?: { day: number; time: string; date: string }) => {
    setTaskFormMode('create');
    setEditingTask(null);
    setInitialDate(initialDate);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskFormMode('edit');
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleViewTask = (task: Task) => {
    setTaskFormMode('view');
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleSwitchToEdit = () => {
    setTaskFormMode('edit');
  };

  const handleDeleteTask = async (task: Task) => {
    await deleteTask(task.id);
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
    console.log('Tasks updated locally:', updatedTasks);
  };

  const handleTaskComplete = async (task: Task) => {
    await completeTask(task.id);
  };

  if (isLoading) return <div>Загрузка задач...</div>;

  return (
    <div className="page-container">
      <div className="header-fixed">
        <div className="header-title-wrapper">
          <ThemeSelector />
          <div className="header-title">Твой план на</div>
          <button className="week-selector" onClick={handleToggleView}>неделю</button>
        </div>
        <div className="notification-icon">🔔</div>
      </div>

      <div className="content-wrapper">
        <ScheduleCalendar
          onAddTask={handleCellAddTask}
          onEditTask={handleEditTask}
          onViewTask={handleViewTask}
          onDeleteTask={handleDeleteTask}
          onCompleteTask={handleTaskComplete}
          tasks={tasks}
          onTasksUpdate={handleTasksUpdate}
        />
      </div>

      <div className="footer-fixed">
        <button className="add-button" onClick={handleAddTaskClick} disabled={isCreating}>
          {isCreating ? 'Создание...' : 'Добавить задачу'}
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
        isSaving={isCreating || isUpdating}
      />
    </div>
  );
};