// ScheduleCalendar.tsx
import React from 'react';

interface Cell {
  id: string;
  time: string; 
  day: number; 
  content: string;
  priority: 'low' | 'medium' | 'high';
  durationMinutes: number; 
  startMinute?: number; 
}

const DAYS = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

const generateTimeSlots = (): string[] => {
  const times: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    const timeStr = `${hour.toString().padStart(2, '0')}:00`;
    times.push(timeStr);
  }
  return times;
};

const mockCells: Cell[] = [
  {
    id: 'task1',
    time: '08:00',
    day: 0,
    content: 'Первая задача ну ооооочень длинная пряма меееега длинная',
    priority: 'medium',
    durationMinutes: 90, 
    startMinute: 0, 
  },
  {
    id: 'task2',
    time: '09:00',
    day: 1,
    content: 'Задача про что то',
    priority: 'medium',
    durationMinutes: 30, 
    startMinute: 15, 
  },
  {
    id: 'task3',
    time: '09:00',
    day: 2,
    content: 'Тут очень важная задача, не представляете насколько важная',
    priority: 'high',
    durationMinutes: 120, 
    startMinute: 0, 
  },
  {
    id: 'task4',
    time: '10:00',
    day: 4,
    content: 'Маленькая задачка, очень маленькая',
    priority: 'low',
    durationMinutes: 15, 
    startMinute: 30, 
  },
  {
    id: 'task5',
    time: '11:00',
    day: 0,
    content: 'Задачка обычная',
    priority: 'low',
    durationMinutes: 60, 
    startMinute: 0,
  },
  {
    id: 'task6',
    time: '12:00',
    day: 3,
    content: 'Задачка необычная',
    priority: 'medium',
    durationMinutes: 180, 
    startMinute: 0,
  },
  {
    id: 'task7',
    time: '13:00',
    day: 6,
    content: 'Тест1',
    priority: 'medium',
    durationMinutes: 180, 
    startMinute: 30, 
  },
  {
    id: 'task8',
    time: '10:00',
    day: 5,
    content: 'Тест2',
    priority: 'medium',
    durationMinutes: 30,  
    startMinute: 45, 
  },

];

const TaskBlock: React.FC<{ task: Cell }> = ({ task }) => {
  const totalHeight = task.durationMinutes;

  const topOffset = task.startMinute || 0;

  let priorityClass = '';
  let textColor = 'text-black';

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

  return (
    <div
      className={`cell has-task ${priorityClass}`}
      style={{
        position: 'absolute',
        top: `calc(${topOffset}px + 1px)`, 
        left: '1%', 
        width: '98%', 
        height: `calc(${totalHeight}px - 4px)`, 
        zIndex: 10,
        opacity: 0.95,
        minHeight: '15px',
        
      }}
    >
      <div className={`task-text ${textColor}`} style={{
        fontSize: '10px', 
        lineHeight: '1.1',
        padding: '2px',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: Math.max(1, Math.floor(totalHeight / 15)), 
        WebkitBoxOrient: 'vertical',
      }}>
        {task.content}
      </div>
    </div>
  );
};

export const ScheduleCalendar: React.FC = () => {
  const timeSlots = generateTimeSlots();

  return (
    <div className="calendar-container">
      <div className="calendar-scroll-container">
        <div className="calendar-header">
          <div>Время</div>
          {DAYS.map((day, i) => (
            <div key={i}>{day}</div>
          ))}
        </div>

        <div className="calendar-body">
          {timeSlots.map((time, rowIndex) => (
            <div key={time} className="calendar-row">
              <div className="time-cell">{time}</div>

              {DAYS.map((_, dayIndex) => {
                const tasksInThisSlot = mockCells.filter((task) => {
                  if (task.day !== dayIndex) return false;
                  const taskHour = parseInt(task.time.split(':')[0]);
                  const currentHour = parseInt(time.split(':')[0]);
                  return taskHour === currentHour;
                });

                return (
                  <div key={dayIndex} className="cell empty" style={{ 
                    position: 'relative',
                    minHeight: '60px',
                    height: '60px'
                  }}>
                    <span className="plus">+</span>
                    {tasksInThisSlot.map((task) => (
                      <TaskBlock key={task.id} task={task} />
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};