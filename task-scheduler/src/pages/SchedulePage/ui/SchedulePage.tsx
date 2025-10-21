import React, { useState } from 'react';
import { ScheduleCalendar } from './ScheduleCalendar';
import { TaskFormModal } from '../../../features/task-form/ui/TaskFormModal';
import { ThemeSelector } from '../../../features/theme-selector/ui/ThemeSelector';
import type { Task } from '../../../entities/task/model/types';

const initialTasks: Task[] = [
  {
    id: 'task1',
    time: '08:00',
    day: 0,
    content: 'Задачка раз',
    priority: 'medium',
    durationMinutes: 90, 
    startMinute: 0, 
    completed: false,
    realDate: '2025-10-22'
  },
  {
    id: 'task2',
    time: '09:00',
    day: 1,
    content: 'Задача про что то',
    priority: 'low',
    durationMinutes: 30, 
    startMinute: 15, 
    completed: false,
    realDate: '2025-10-21'
  },
  {
    id: 'task3',
    time: '09:00',
    day: 2,
    content: 'Тут очень важная задача',
    priority: 'high',
    durationMinutes: 120, 
    startMinute: 0, 
    completed: false,
    realDate: '2025-10-20'
  },
  
];

export const SchedulePage: React.FC = () => {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskFormMode, setTaskFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [initialDate, setInitialDate] = useState<{ day: number; time: string; date: string } | undefined>();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleToggleView = () => {
    alert("Переключение режима: неделя → день → месяц");
  };

  const handleAddTaskClick = () => {
    setTaskFormMode('create');
    setEditingTask(null);
    setInitialDate(undefined); 
    setIsTaskFormOpen(true);
  };

  const handleCellAddTask = (initialDate: { day: number; time: string; date: string }) => {
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

  const handleSaveTask = (taskData: Partial<Task>) => {
    console.log('Сохранение задачи:', taskData);
    
    if (taskFormMode === 'create') {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        time: taskData.startTime || '00:00',
        day: 0,
        content: taskData.title || '',
        priority: taskData.priority || 'medium',
        durationMinutes: taskData.durationMinutes || 60,
        startMinute: 0,
        completed: false,
        title: taskData.title,
        description: taskData.description,
        startDate: taskData.startDate,
        endDate: taskData.endDate,
        startTime: taskData.startTime,
        endTime: taskData.endTime,
        realDate: initialDate?.date || taskData.startDate || new Date().toISOString().split('T')[0]
      };

      setTasks(prev => [...prev, newTask]);
    
    } else if (taskFormMode === 'edit' && editingTask) {
      const updatedTasks = tasks.map(task =>
        task.id === editingTask.id
          ? { ...task, ...taskData }
          : task
      );
      setTasks(updatedTasks);
    }
  };

  const handleTasksUpdate = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  };

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
          tasks={tasks}
          onTasksUpdate={handleTasksUpdate}
        />
      </div>

      <div className="footer-fixed">
        <button className="add-button" onClick={handleAddTaskClick}>
          Добавить задачу
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
    />
    </div>
  );
};