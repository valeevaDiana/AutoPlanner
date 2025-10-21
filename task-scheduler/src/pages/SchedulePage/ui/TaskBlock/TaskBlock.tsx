import React from 'react';
import type { Task } from '../../../../entities/task/model/types';
import { getTextSettings } from './TaskBlock.utils';

interface TaskBlockProps {
  task: Task;
  width: string;
  left: string;
  taskCount: number;
  onTaskClick: (task: Task, event: React.MouseEvent) => void;
}

export const TaskBlock: React.FC<TaskBlockProps> = ({
  task,
  width,
  left,
  taskCount,
  onTaskClick
}) => {
  const totalHeight = task.durationMinutes;
  const topOffset = task.startMinute || 0;
  const isCompleted = task.completed;

  let priorityClass = '';
  let textColor = 'text-black';

  if (isCompleted) {
    priorityClass = 'priority-completed';
    textColor = 'text-completed';
  } else {
    if (task.priority === 'low') {
      priorityClass = 'priority-low';
      textColor = 'text-green';
    } else if (task.priority === 'medium') {
      priorityClass = 'priority-medium';
      textColor = 'text-yellow';
    } else if (task.priority === 'high') {
      priorityClass = 'priority-high';
      textColor = 'text-red';
    }
  }

  const textSettings = getTextSettings(taskCount, totalHeight);

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onTaskClick(task, event);
  };

  return (
    <div
      className={`task-block ${priorityClass}`}
      style={{
        position: 'absolute',
        top: `calc(${topOffset}px + 1px)`,
        left: left,
        width: width,
        height: `calc(${totalHeight}px - 4px)`,
        zIndex: 10,
        opacity: isCompleted ? 0.7 : 0.95,
        minHeight: '15px',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: '2px',
        boxSizing: 'border-box',
        padding: '1px',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <div
        className={`task-text ${textColor}`}
        style={{
          fontSize: textSettings.fontSize,
          lineHeight: '1.0',
          padding: '1px',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: textSettings.lineClamp,
          WebkitBoxOrient: 'vertical',
          width: '100%',
          height: '100%',
          wordBreak: 'break-word',
          textOverflow: 'ellipsis',
          textDecoration: isCompleted ? 'line-through' : 'none',
        }}
      >
        {task.content}
      </div>
    </div>
  );
};