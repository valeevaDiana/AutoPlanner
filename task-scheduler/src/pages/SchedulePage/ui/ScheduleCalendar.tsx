import { ConfirmDeleteModal } from '../../../features/task-actions/ui/ConfirmDeleteModal'; 
import React, { useState } from 'react';
import type { Task, TaskAction } from '../../../entities/task/model/types'; 
import { TaskActionsModal } from '../../../features/task-actions/ui/TaskActionsModal';
import { useWeekNavigation } from '../../../shared/lib/hooks/useWeekNavigation';
import { useTheme } from '../../../shared/lib/contexts';
import { getContrastColor, getPriorityColor } from '../../../shared/lib/utils/priorityGradient';

const DAYS = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

const generateTimeSlots = (): string[] => {
  const times: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    const timeStr = `${hour.toString().padStart(2, '0')}:00`;
    times.push(timeStr);
  }
  return times;
};

interface ScheduleCalendarProps {
  onAddTask?: (initialDate?: { day: number; time: string; date: string }) => void;
  onEditTask?: (task: Task) => void; 
  onViewTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void; 
  onCompleteTask?: (task: Task) => void;
  onAction?: (action: TaskAction) => void;
  tasks: Task[];
  onTasksUpdate?: (tasks: Task[]) => void;
}

const getOverlappingTasks = (tasks: Task[]): Task[][] => {

  const groups: Task[][] = [];
  
  tasks.forEach(task => {
    let taskStart = 0;
    if (task.startTime) {
      const [hours, minutes] = task.startTime.split(':').map(Number);
      taskStart = hours * 60 + minutes; // Начало задачи в минутах
    }
    let taskEnd = 0;
    if (task.endTime) {
      const [hours, minutes] = task.endTime.split(':').map(Number);
      taskEnd = hours * 60 + minutes; // Начало задачи в минутах
    }
    // const taskEnd = taskStart + task.durationMinutes;

    let addedToGroup = false;
    
    for (const group of groups) {
      const groupHasOverlap = group.some(groupTask => {
        let groupStart = 0;
        if (groupTask.startTime) {
          const [hours, minutes] = groupTask.startTime.split(':').map(Number);
          groupStart = hours * 60 + minutes;
        }
        const groupEnd = groupStart + groupTask.durationMinutes;
        
        return taskStart < groupEnd && taskEnd > groupStart;
      });

      if (groupHasOverlap) {
        group.push(task);
        addedToGroup = true;
        break;
      }
    }

    if (!addedToGroup) {
      groups.push([task]);
    }
  });

  return groups;
};

const getTaskPosition = (task: Task, overlappingGroup: Task[], taskIndex: number) => {
  const totalTasks = overlappingGroup.length;
  
  const maxTasks = Math.min(totalTasks, 5);
  
  if (maxTasks === 1) {
    return { width: 'calc(100% - 4px)', left: '2px' };
  } else {
    const availableWidth = 100 - 4; 
    const taskWidth = availableWidth / maxTasks;
    const width = `calc(${taskWidth}% - 2px)`;
    const left = `calc(${2 + (taskIndex * taskWidth)}% + 1px)`;
    return { width, left };
  }
};

interface TaskBlockProps {
  task: Task;
  width: string;
  left: string;
  taskCount: number;
  onTaskClick: (task: Task, event: React.MouseEvent) => void;
}

const TaskBlock: React.FC<TaskBlockProps> = ({ 
  task, 
  width, 
  left, 
  taskCount,
  onTaskClick 
}) => {
  const { currentTheme } = useTheme();

  const totalHeight = task.durationMinutes;
  let topOffset = 0;
  if (task.startTime) {
    const [hours, minutes] = task.startTime.split(':').map(Number);
    topOffset = minutes; 
  }
  const isCompleted = task.completed;

  /*console.log('Task data:', {
    title: task.title,
    startTime: task.startTime,
    durationMinutes: task.durationMinutes,
    calculatedHeight: totalHeight,
    calculatedTop: topOffset
  });*/

  const backgroundColor = getPriorityColor(
    task.priority, 
    currentTheme.colors.priorityLow, 
    currentTheme.colors.priorityHigh
  );

  const textColor = getContrastColor(backgroundColor);

  const getTextSettings = () => {
    const maxLines = Math.max(1, Math.floor(totalHeight / 20));
  
    switch (taskCount) {
      case 1:
        return { fontSize: '14px', lineClamp: maxLines };
      case 2:
        return { fontSize: '12px', lineClamp: maxLines };
      case 3:
        return { fontSize: '11px', lineClamp: maxLines };
      case 4:
        return { fontSize: '10px', lineClamp: maxLines };
      case 5:
        return { fontSize: '9px', lineClamp: maxLines };
      default:
        return { fontSize: '9px', lineClamp: 1 };
    }
  };


  const textSettings = getTextSettings();

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onTaskClick(task, event);
  };

  return (
    <div
      className="task-block"
      style={{
        position: 'absolute',
        top: `calc(${topOffset}px + 1px)`,
        //top: `1px`,
        // top: `${topOffset}px`,
        left: left,
        width: width,
        height: `calc(${totalHeight}px - 4px)`,
        //height: `60px`,
        zIndex: 10,
        opacity: isCompleted ? 0.7 : 0.95,
        minHeight: '15px',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: '2px',
        boxSizing: 'border-box',
        padding: '1px',
        cursor: 'pointer',
        backgroundColor: isCompleted ? currentTheme.colors.priorityCompleted : backgroundColor,
      }}
      onClick={handleClick}
    >
      <div
        className="task-text"
        style={{
          fontSize: textSettings.fontSize,
          lineHeight: '1.2', 
          padding: '1px', 
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: textSettings.lineClamp,
          WebkitBoxOrient: 'vertical',
          width: '100%',
          // height: '100%',
          maxHeight: `calc(${totalHeight - 4 - 2}px)`, 
          wordBreak: 'break-word',
          textOverflow: 'ellipsis ',
          textDecoration: isCompleted ? 'line-through' : 'none',
          color: isCompleted ? currentTheme.colors.priorityCompletedText : textColor,
        }}
      >
        {task.title}
      </div>
    </div>
  );
};

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  onAddTask,
  onEditTask, 
  onViewTask,
  onDeleteTask,
  onCompleteTask, 
  onAction, 
  tasks,
  onTasksUpdate
}) => {
  const { currentTheme } = useTheme();
  const timeSlots = generateTimeSlots();
  const {
    weekDates,
    nextWeek,
    prevWeek,
    goToToday,
    formatDate,
    getISODate
  } = useWeekNavigation();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalPosition, setDeleteModalPosition] = useState({ top: 0, left: 0 });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);


  const getTasksForDate = (date: Date) => {
    const dateString = getISODate(date);
    
    const tasksForDate = tasks.filter(task => {
      const matches = task.realDate === dateString;
      if (matches) {
        //console.log('Task matches:', task.title, task.realDate, task.startTime);
      }
      return matches;
    });
    
    return tasksForDate;
  };

  // const getTasksForDate = (date: Date) => {
  //   const dateString = getISODate(date);
  //   return tasks.filter(task => task.realDate === dateString);
  // };

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

  const handleEmptyCellClick = (dayIndex: number, time: string, date: Date) => {
    if (onAddTask) {
      onAddTask({
        day: dayIndex,
        time: time,
        date: getISODate(date)
      });
    }
  };

  const handleTaskAction = (action: TaskAction) => {
    if (!selectedTask) return;
    if (action === 'complete') {
      if (onCompleteTask) {
        onCompleteTask(selectedTask);
      }
    } else {
      if (onAction) { 
        onAction(action);
      }
    }
  };


  const handleDirectEdit = (task: Task) => {
    if (onEditTask) {
      onEditTask(task);
    }
  };

  const handleTaskDelete = (task: Task) => {
    setTaskToDelete(task);
    setDeleteModalPosition(modalPosition); 
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (task: Task) => {
    if (onDeleteTask) {
      onDeleteTask(task);
    }
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const weekRange = `${formatDate(weekDates[0])} - ${formatDate(weekDates[6])}`;

  return (
    <div className="calendar-container">
      {/* Навигация по неделям */}
      <div className="calendar-navigation">
        <button
          onClick={prevWeek}
          style={{
            padding: '8px 16px',
            backgroundColor: currentTheme.colors.primary,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '20px',
            fontWeight: '600'
          }}
        >
          ←
        </button>
        
        <div style={{ textAlign: 'center' }}>
          <div className="week-range-text" style={{ fontSize: '18px', fontWeight: '600', color: currentTheme.colors.text }}>
            {weekRange}
          </div>
          <button
            onClick={goToToday}
            style={{
              marginTop: '5px',
              padding: '4px 12px',
              backgroundColor: 'transparent',
              color: currentTheme.colors.primary,
              border: `1px solid ${currentTheme.colors.primary}`,
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Сегодня
          </button>
        </div>
        
        <button
          onClick={nextWeek}
          style={{
            padding: '8px 16px',
            backgroundColor: currentTheme.colors.primary,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '20px',
            fontWeight: '600'
          }}
        >
          →
        </button>
      </div>  

      <div className="calendar-scroll-container">
        <div className="calendar-header">
          <div>Время</div>
          {weekDates.map((date, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontWeight: '600' }}>{DAYS[index]}</div>
              <div style={{ fontSize: '12px', color: currentTheme.colors.textSecondary, marginTop: '2px' }}>
                {formatDate(date)}
              </div>
            </div>
          ))}
        </div>

        <div className="calendar-body">
          {timeSlots.map((time) => ( 
            <div key={time} className="calendar-row">
              <div className="time-cell">{time}</div>

              {weekDates.map((date, dayIndex) => {
                const tasksForDate = getTasksForDate(date);
                const tasksInThisSlot = tasksForDate.filter((task) => {
                  const taskHour = parseInt(task.startTime?.split(':')[0] || '0', 10);
                  const currentHour = parseInt(time.split(':')[0], 10);
                  return taskHour === currentHour;
                });

                const overlappingGroups = getOverlappingTasks(tasksInThisSlot);

                return (
                  <div 
                    key={dayIndex} 
                    className="cell empty" 
                    style={{ 
                      position: 'relative',
                      minHeight: '60px',
                      height: '60px'
                    }}
                    onClick={() => handleEmptyCellClick(dayIndex, time, date)}
                  >
                    <span className="plus">+</span>
                    
                    {overlappingGroups.map((group) => 
                      group.map((task, taskIndex) => {
                        const position = getTaskPosition(task, group, taskIndex);
                        return (
                          <TaskBlock 
                            key={task.id} 
                            task={task} 
                            width={position.width}
                            left={position.left}
                            taskCount={group.length}
                            onTaskClick={handleTaskClick}
                          />
                        );
                      })
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {selectedTask && (
      <TaskActionsModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onAction={handleTaskAction}
        onEdit={handleDirectEdit} 
        onDelete={handleTaskDelete} 
        onComplete={onCompleteTask}
        onViewTask={onViewTask} 
        position={modalPosition}
      />
    )}
      {taskToDelete && (
          <ConfirmDeleteModal
            task={taskToDelete}
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
            position={deleteModalPosition}
          />
        )}
    </div>
  );
};