import React from 'react';
import type { Task } from '../../../entities/task/model/types';
import { TaskBlockGroup } from './TaskBlock/TaskBlockGroup';
import { getOverlappingTasks } from './TaskBlock/TaskBlock.utils';

interface TimeSlotCellProps {
  dayIndex: number;
  time: string;
  date: Date;
  tasks: Task[];
  onTaskClick: (task: Task, event: React.MouseEvent) => void;
  onEmptyCellClick: (dayIndex: number, time: string, date: Date) => void;
  getISODate: (date: Date) => string;
}

export const TimeSlotCell: React.FC<TimeSlotCellProps> = ({
  dayIndex,
  time,
  date,
  tasks,
  onTaskClick,
  onEmptyCellClick,
  getISODate
}) => {
  const tasksForDate = tasks.filter((task) => task.realDate === getISODate(date));
  const tasksInThisSlot = tasksForDate.filter((task) => {
    const taskHour = parseInt(task.time.split(':')[0]);
    const currentHour = parseInt(time.split(':')[0]);
    return taskHour === currentHour;
  });

  const overlappingGroups = getOverlappingTasks(tasksInThisSlot);

  return (
    <div
      className="cell empty"
      style={{
        position: 'relative',
        minHeight: '60px',
        height: '60px',
        cursor: 'pointer'
      }}
      onClick={() => onEmptyCellClick(dayIndex, time, date)}
    >
      <span className="plus" style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '18px',
        color: '#ccc',
        opacity: 0.5
      }}>
        +
      </span>
      
      {overlappingGroups.map((group, groupIndex) => (
        <TaskBlockGroup
          key={groupIndex}
          group={group}
          onTaskClick={onTaskClick}
        />
      ))}
    </div>
  );
};