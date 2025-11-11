import React, { useState, useEffect } from 'react';
import { ScheduleCalendar } from './ScheduleCalendar';
import { TaskFormModal } from '../../../features/task-form/ui/TaskFormModal';
import { ThemeSelector } from '../../../features/theme-selector/ui/ThemeSelector';
import type { Task } from '../../../entities/task/model/types';
import { useTasks } from '../../../shared/lib/hooks/useTasks';
import { taskApi } from '../../../shared/api/taskApi';

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
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [isLoadingTask, setIsLoadingTask] = useState(false);

  useEffect(() => {
      if (isTaskFormOpen) {
        loadAvailableTasks();
      }
    }, [isTaskFormOpen]);
  
  const loadAvailableTasks = async () => {
    try {
      // Предполагаем, что у вас есть currentUserId
      const currentUserId = 1; // Замените на реальный ID пользователя
      const tasks = await taskApi.getAvailableTasks(currentUserId);
      setAvailableTasks(tasks);
    } catch (error) {
      console.error('Failed to load available tasks:', error);
      // В случае ошибки используем существующие tasks как fallback
      setAvailableTasks(tasks);
    }
  };

  const loadTaskById = async (taskId: string): Promise<Task | null> => {
    try {
      setIsLoadingTask(true);
      const task = await taskApi.getTaskById(taskId);
      return task;
    } catch (error) {
      console.error('Failed to load task:', error);
      return null;
    } finally {
      setIsLoadingTask(false);
    }
  };

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

  const handleEditTask = async (task: Task) => {
    setTaskFormMode('edit');
    
    // Сначала показываем форму с базовыми данными
    setEditingTask(task);
    setIsTaskFormOpen(true);
    
    // Затем загружаем полные данные через API
    const fullTask = await loadTaskById(task.id);
    if (fullTask) {
      setEditingTask(fullTask);
    }
  };

  const handleViewTask = async (task: Task) => {
    setTaskFormMode('view');
    
    // Сначала показываем форму с базовыми данными
    setEditingTask(task);
    setIsTaskFormOpen(true);
    
    // Затем загружаем полные данные через API
    const fullTask = await loadTaskById(task.id);
    if (fullTask) {
      setEditingTask(fullTask);
    }
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
        isSaving={isCreating || isUpdating || isLoadingTask}
        availableTasks={availableTasks}
      />
    </div>
  );
};