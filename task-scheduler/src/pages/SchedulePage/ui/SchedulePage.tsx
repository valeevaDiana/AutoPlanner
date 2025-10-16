import React, { useState } from 'react';
import { ScheduleCalendar } from './ScheduleCalendar';
import { TaskFormModal } from '../../../features/task-form/ui/TaskFormModal';
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
    realDate: '2025-10-16'
  },
  {
    id: 'task2',
    time: '09:00',
    day: 1,
    content: 'Задача про что то',
    priority: 'medium',
    durationMinutes: 30, 
    startMinute: 15, 
    completed: false,
    realDate: '2025-10-13'
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
    realDate: '2025-10-19'
  },
  {
    id: 'task4',
    time: '10:00',
    day: 4,
    content: 'Маленькая задачка',
    priority: 'low',
    durationMinutes: 20, 
    startMinute: 30,
    completed: false, 
    realDate: '2025-10-20'
  },
  {
    id: 'task5',
    time: '11:00',
    day: 0,
    content: 'Задачка обычная',
    priority: 'low',
    durationMinutes: 60, 
    startMinute: 0,
    completed: false,
    realDate: '2025-10-01'
  },
  {
    id: 'task6',
    time: '12:00',
    day: 3,
    content: 'Задача 1 (пересекается)',
    priority: 'medium',
    durationMinutes: 180, 
    startMinute: 0,
    completed: false,
    realDate: '2025-10-27'
  },
  {
    id: 'task7',
    time: '12:00',
    day: 3,
    content: 'Задача 2 (пересекается)',
    priority: 'medium',
    durationMinutes: 180, 
    startMinute: 15,
    completed: false,
    realDate: '2025-10-27'
  },
  {
    id: 'task8',
    time: '13:00',
    day: 6,
    content: 'Тест1',
    priority: 'medium',
    durationMinutes: 180, 
    startMinute: 30, 
    completed: false,
    realDate: '2025-10-16'
  },
  {
    id: 'task9',
    time: '10:00',
    day: 5,
    content: 'Подготовка к завтрашнему рабочему дню: составление списка дел на завтра, выбор одежды, в которой завтра нужно пойти на встречу, и другие дела',
    priority: 'medium',
    durationMinutes: 30,  
    startMinute: 45, 
    completed: false,
    realDate: '2025-11-30'
  },
  {
    id: 'task10',
    time: '10:00',
    day: 5,
    content: 'Подготовка к завтрашнему рабочему дню: составление списка дел на завтра, выбор одежды, в которой завтра нужно пойти на встречу, и другие дела',
    priority: 'medium',
    durationMinutes: 30,  
    startMinute: 45,
    completed: false, 
    realDate: '2025-11-30'
  },
  {
    id: 'task11',
    time: '10:00',
    day: 5,
    content: 'Подготовка к завтрашнему рабочему дню: составление списка дел на завтра, выбор одежды, в которой завтра нужно пойти на встречу, и другие дела',
    priority: 'medium',
    durationMinutes: 130,  
    startMinute: 45, 
    completed: false,
    realDate: '2025-11-30'
  },
  {
    id: 'task12',
    time: '10:00',
    day: 5,
    content: 'Подготовка к завтрашнему рабочему дню: составление списка дел на завтра, выбор одежды, в которой завтра нужно пойти на встречу, и другие дела',
    priority: 'medium',
    durationMinutes: 30,  
    startMinute: 45,
    completed: false, 
    realDate: '2025-11-30'
  },
  {
    id: 'task13',
    time: '10:00',
    day: 5,
    content: 'Подготовка к завтрашнему рабочему дню: составление списка дел на завтра, выбор одежды, в которой завтра нужно пойти на встречу, и другие дела',
    priority: 'medium',
    durationMinutes: 130,  
    startMinute: 45, 
    completed: false,
    realDate: '2025-11-30'
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