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
import { TelegramConnectionModal } from '../../../features/telegram-connection/ui/TelegramConnectionModal';

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

  const { currentTheme } = useTheme();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskFormMode, setTaskFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [initialDate, setInitialDate] = useState<{ day: number; time: string; date: string } | undefined>();
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [isLoadingTask, setIsLoadingTask] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);

  const [penaltyTasks, setPenaltyTasks] = useState<PenaltyTask[]>([]);
  const [isPenaltyModalOpen, setIsPenaltyModalOpen] = useState(false);

  const USER_ID = 1; 

  useEffect(() => {
    loadPenaltyTasks();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      loadPenaltyTasks();
    }
  }, [tasks, isLoading]);

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

  const loadPenaltyTasks = async () => {
    try {
      console.log('Loading penalty tasks...');
      const response = await fetch(`/api/time-table/${USER_ID}`);
      if (response.ok) {
        const data = await response.json();
        setPenaltyTasks(data.penaltyTasks || []);
      } else {
        console.error('Failed to load penalty tasks:', response.status);
      }
    } catch (error) {
      console.error('Error loading penalty tasks:', error);
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

  const handlePenaltyTasksClick = () => {
    loadPenaltyTasks();
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
          <div className="header-title">План на</div>
          <button className="week-selector" onClick={handleToggleView}>неделю</button>

          {penaltyTasks.length > 0 && (
            <button
              onClick={handlePenaltyTasksClick}
              style={{
                backgroundColor: currentTheme.colors.error,
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              🚫
            </button>
          )}
        </div>
        <div className="notification-icon" onClick={() => setIsTelegramModalOpen(true)} style={{ cursor: 'pointer' }}>
          🔔
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

      <TelegramConnectionModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
        userId={USER_ID}
      />
    </div>
  );
};