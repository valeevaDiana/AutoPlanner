import React, { useState } from 'react';
import { ScheduleCalendar } from './ScheduleCalendar';
import { TaskFormModal } from '../../../features/task-form/ui/TaskFormModal';
import type { Task } from '../../../entities/task/model/types';

export const SchedulePage: React.FC = () => {
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

  const handleSaveTask = (taskData: Partial<Task>) => {
    console.log('Сохранение задачи:', taskData);
    if (taskFormMode === 'create') {
      alert('Создание новой задачи: ' + taskData.title);
    } else if (taskFormMode === 'edit') {
      alert('Редактирование задачи: ' + taskData.title);
    }
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
        task={editingTask}
        mode={taskFormMode}
        initialDate={initialDate}
      />
    </div>
  );
};