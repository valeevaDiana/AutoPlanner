import React from 'react';
import { useTheme } from '../../../shared/lib/contexts';
import { useWeekNavigation } from '../../../shared/lib/hooks/useWeekNavigation';
import type { Task } from '../../../entities/task/model/types';
import { generateTimeSlots } from './Calendar.hooks';
import { TimeSlotCell } from './TimeSlotCell';

interface CalendarBodyProps {
  tasks: Task[];
  onTaskClick: (task: Task, event: React.MouseEvent) => void;
  onEmptyCellClick: (dayIndex: number, time: string, date: Date) => void;
}

export const CalendarBody: React.FC<CalendarBodyProps> = ({
  tasks,
  onTaskClick,
  onEmptyCellClick
}) => {
  const { currentTheme } = useTheme();
  const { weekDates, getISODate } = useWeekNavigation();
  const timeSlots = generateTimeSlots();

  return (
    <div className="calendar-body" style={{
      display: 'flex',
      flexDirection: 'column',
      border: `1px solid ${currentTheme.colors.border}`,
      borderTop: 'none'
    }}>
      {timeSlots.map((time) => (
        <div 
          key={time} 
          className="calendar-row"
          style={{
            display: 'grid',
            gridTemplateColumns: '100px repeat(7, 1fr)',
            gap: '1px',
            backgroundColor: currentTheme.colors.border
          }}
        >
          <div 
            className="time-cell"
            style={{
              padding: '10px',
              backgroundColor: currentTheme.colors.timeCell,
              fontSize: '14px',
              color: currentTheme.colors.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {time}
          </div>
          
          {weekDates.map((date, dayIndex) => (
            <TimeSlotCell
              key={dayIndex}
              dayIndex={dayIndex}
              time={time}
              date={date}
              tasks={tasks}
              onTaskClick={onTaskClick}
              onEmptyCellClick={onEmptyCellClick}
              getISODate={getISODate}
            />
          ))}
        </div>
      ))}
    </div>
  );
};