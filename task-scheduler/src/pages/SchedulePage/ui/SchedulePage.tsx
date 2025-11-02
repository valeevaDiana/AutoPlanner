import React, { useState } from 'react';
import { ScheduleCalendar } from './ScheduleCalendar';
import { TaskFormModal } from '../../../features/task-form/ui/TaskFormModal';
import { ThemeSelector } from '../../../features/theme-selector/ui/ThemeSelector';
import type { Task } from '../../../entities/task/model/types';

const initialTasks: Task[] = [
  {
    id: 'task1',
    time: '08:00',
    content: 'Старый дуб, весь преображенный, раскинувшись шатром сочной, темной зелени, млел, чуть колыхаясь Старый дуб, весь преображенный, раскинувшись шатром сочной, темной зелени, млел, чуть колыхаясь Старый дуб, весь преображенный, раскинувшись шатром сочной, темной зелени, млел, чуть колыхаясь',
    priority: 5,
    durationMinutes: 247, 
    startMinute: 0, 
    completed: false,
    realDate: '2025-10-28'
  },
  {
    id: 'task2',
    time: '09:00',
    content: 'Задача очень важная Задача очень важная Задача очень важная',
    priority: 1,
    durationMinutes: 30, 
    startMinute: 15, 
    completed: false,
    realDate: '2025-10-31'
  },
   {
    id: 'task3',
    time: '09:00',
    content: 'Тут очень НЕважная задача',
    priority: 10,
    durationMinutes: 120, 
    startMinute: 0, 
    completed: false,
    realDate: '2025-10-30'
  },
  {
    id: '1',
    time: '05:00',
    content: 'ПРИМЕР ТЕКСТА ДЛЯ ПРОСМОТРА ЦВЕТА ТЕКСТА и еще немного текста просто так бла бла бл',
    priority: 10,
    durationMinutes: 60, 
    startMinute: 0, 
    completed: false,
    realDate: '2025-10-27'
  },
  {
    id: '2',
    time: '05:00',
    content: 'ПРИМЕР ТЕКСТА ДЛЯ ПРОСМОТРА ЦВЕТА ТЕКСТА',
    priority: 9,
    durationMinutes: 60, 
    startMinute: 0, 
    completed: false,
    realDate: '2025-10-28'
  },
  {
    id: '3',
    time: '05:00',
    content: 'ПРИМЕР ТЕКСТА ДЛЯ ПРОСМОТРА ЦВЕТА ТЕКСТА',
    priority: 7,
    durationMinutes: 60, 
    startMinute: 0, 
    completed: false,
    realDate: '2025-10-29'
  },
  {
    id: '4',
    time: '05:00',
    content: 'ПРИМЕР ТЕКСТА ДЛЯ ПРОСМОТРА ЦВЕТА ТЕКСТА',
    priority: 5,
    durationMinutes: 60, 
    startMinute: 0, 
    completed: false,
    realDate: '2025-10-30'
  },
  {
    id: '5',
    time: '05:00',
    content: 'ПРИМЕР ТЕКСТА ДЛЯ ПРОСМОТРА ЦВЕТА ТЕКСТА',
    priority: 4,
    durationMinutes: 60, 
    startMinute: 0, 
    completed: false,
    realDate: '2025-10-31'
  },
  {
    id: '6',
    time: '05:00',
    content: 'ПРИМЕР ТЕКСТА ДЛЯ ПРОСМОТРА ЦВЕТА ТЕКСТА',
    priority: 2,
    durationMinutes: 60, 
    startMinute: 0, 
    completed: false,
    realDate: '2025-11-01'
  },
  {
    id: '7',
    time: '05:00',
    content: 'ПРИМЕР ТЕКСТА ДЛЯ ПРОСМОТРА ЦВЕТА ТЕКСТА',
    priority: 1,
    durationMinutes: 60, 
    startMinute: 0, 
    completed: false,
    realDate: '2025-11-02'
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

  const handleDeleteTask = (task: Task) => {
    const updatedTasks = tasks.filter(t => t.id !== task.id);
    setTasks(updatedTasks);
    console.log('Задача удалена:', task.id);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    console.log('Сохранение задачи:', taskData);
    
    if (taskFormMode === 'create') {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        time: taskData.startTime || '00:00',
        content: taskData.title || '',
        priority: taskData.priority || 5,
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
          onDeleteTask={handleDeleteTask} 
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