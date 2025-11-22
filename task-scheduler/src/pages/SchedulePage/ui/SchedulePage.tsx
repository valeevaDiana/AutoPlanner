import React, { useState, useEffect } from 'react';
import { ScheduleCalendar } from './ScheduleCalendar';
import { TaskFormModal } from '../../../features/task-form/ui/TaskFormModal';
import { PenaltyTasksModal } from '../../../features/penalty-tasks/ui/PenaltyTasksModal';
import { ThemeSelector } from '../../../features/theme-selector/ui/ThemeSelector';
import { useTheme } from '../../../shared/lib/contexts';
import type { Task } from '../../../entities/task/model/types';
import type { PenaltyTask } from '../../../shared/api/types'; 
import { useTasks } from '../../../shared/lib/hooks/useTasks';
import { taskApi } from '../../../shared/api/taskApi';
import { useTaskSplitter } from '../../../shared/lib/hooks/useTaskSplitter';
import { AuthModal } from '../../../features/auth/ui/AuthModal';
import { getContrastColor } from '../../../shared/lib/utils/priorityGradient';

export const SchedulePage: React.FC = () => {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const {
    tasks,
    penaltyTasks, 
    isLoading,
    isLoadingPenalty,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    isCreating,
    isUpdating,
    isDeleting,
  } = useTasks(currentUserId || undefined);

  const { currentTheme } = useTheme();
  const { getOriginalTaskFromPart } = useTaskSplitter();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskFormMode, setTaskFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [initialDate, setInitialDate] = useState<{ day: number; time: string; date: string } | undefined>();
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [isLoadingTask, setIsLoadingTask] = useState(false);

  const [isPenaltyModalOpen, setIsPenaltyModalOpen] = useState(false);

  useEffect(() => {
      if (isTaskFormOpen) {
        loadAvailableTasks();
      }
    }, [isTaskFormOpen]);

  useEffect(() => {
    const savedUserId = localStorage.getItem('currentUserId');
    if (savedUserId) {
      const userId = Number(savedUserId);
      setCurrentUserId(userId);
    } else {
      setIsAuthModalOpen(true);
    }

  }, []);

  
  const loadAvailableTasks = async () => {
    try {
      if (!currentUserId) return;
      const tasks = await taskApi.getAvailableTasks(currentUserId);

      setAvailableTasks(tasks);
    } catch (error) {
      console.error('Failed to load available tasks:', error);
      setAvailableTasks(tasks);
    }
  };

  const handleAuthSuccess = (userId: number) => {
    setCurrentUserId(userId);
    localStorage.setItem('currentUserId', userId.toString());
    setIsAuthModalOpen(false);
  };

  if (!currentUserId) {
    return <AuthModal isOpen={isAuthModalOpen} onAuthSuccess={handleAuthSuccess} />;
  }

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

  const handlePenaltyTasksClick = () => {
    setIsPenaltyModalOpen(true);
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
    const taskToEdit = getOriginalTaskFromPart(task, tasks) || task;
    setTaskFormMode('edit');
    setEditingTask(taskToEdit);
    setIsTaskFormOpen(true);
  };

  const handleViewTask = async (task: Task) => {
    const taskToView = getOriginalTaskFromPart(task, tasks) || task;
    setTaskFormMode('view');
    setEditingTask(taskToView);
    setIsTaskFormOpen(true);
  };


  const handleSwitchToEdit = () => {
    setTaskFormMode('edit');
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
    console.log('Tasks updated locally:', updatedTasks);
  };

  const handleTaskComplete = async (task: Task) => {
    const taskToComplete = getOriginalTaskFromPart(task, tasks) || task;
    await completeTask(taskToComplete.id);
  };

  const getPenaltyButtonFontSize = (count: number): string => {
    if (count >= 10000) return '12px';
    if (count >= 1000) return '14px';
    if (count >= 100) return '16px';
    if (count >= 10) return '18px';
    return '20px';
  };


  if (isLoading) return <div>Загрузка задач...</div>;

  return (
    <div className="page-container">
      <div className="header-fixed">
        {/* Первая строка: уведомления, темы, выход */}
        <div 
          className="header-top-row"
          style={{
            backgroundColor: currentTheme.colors.background
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="notification-icon">🔔</div>
            <ThemeSelector />
          </div>
          
          {/* Кнопка выхода */}
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
          </button>
        </div>

        {/* Вторая строка: заголовок и штрафные задачи */}
        <div 
          className="header-bottom-row"
          style={{
            backgroundColor: currentTheme.colors.background
          }}
        >
          <div className="header-title-wrapper">
            <div className="header-title">План на</div>
            <button className="week-selector" onClick={handleToggleView}>неделю</button>

            <button
              onClick={handlePenaltyTasksClick}
              style={{
                backgroundColor: currentTheme.colors.error,
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: getPenaltyButtonFontSize(penaltyTasks.length),
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                minWidth: '30px',
                justifyContent: 'center',
                marginLeft: '5px'
              }}
            >
              {penaltyTasks.length}
            </button>
          </div>
        </div>
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

      <PenaltyTasksModal
        isOpen={isPenaltyModalOpen}
        onClose={() => setIsPenaltyModalOpen(false)}
        penaltyTasks={penaltyTasks}
      />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onAuthSuccess={handleAuthSuccess} 
      />
    </div>
  );
};