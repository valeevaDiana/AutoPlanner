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
    content: 'Задачка раз',
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
    content: 'Тут очень важная задача',
    priority: 'high',
    durationMinutes: 120, 
    startMinute: 0, 
  },
  {
    id: 'task4',
    time: '10:00',
    day: 4,
    content: 'Маленькая задачка',
    priority: 'low',
    durationMinutes: 20, 
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
    content: 'Задача 1 (пересекается)',
    priority: 'medium',
    durationMinutes: 180, 
    startMinute: 0,
  },
  {
    id: 'task7',
    time: '12:00',
    day: 3,
    content: 'Задача 2 (пересекается)',
    priority: 'medium',
    durationMinutes: 180, 
    startMinute: 15,
  },
  {
    id: 'task8',
    time: '13:00',
    day: 6,
    content: 'Тест1',
    priority: 'medium',
    durationMinutes: 180, 
    startMinute: 30, 
  },
  {
    id: 'task9',
    time: '10:00',
    day: 5,
    content: 'Подготовка к завтрашнему рабочему дню: составление списка дел на завтра, выбор одежды, в которой завтра нужно пойти на встречу, и другие дела',
    priority: 'medium',
    durationMinutes: 30,  
    startMinute: 45, 
  },
  {
    id: 'task10',
    time: '10:00',
    day: 5,
    content: 'Подготовка к завтрашнему рабочему дню: составление списка дел на завтра, выбор одежды, в которой завтра нужно пойти на встречу, и другие дела',
    priority: 'medium',
    durationMinutes: 30,  
    startMinute: 45, 
  },
  {
    id: 'task11',
    time: '10:00',
    day: 5,
    content: 'Подготовка к завтрашнему рабочему дню: составление списка дел на завтра, выбор одежды, в которой завтра нужно пойти на встречу, и другие дела',
    priority: 'medium',
    durationMinutes: 130,  
    startMinute: 45, 
  },
  {
    id: 'task12',
    time: '10:00',
    day: 5,
    content: 'Подготовка к завтрашнему рабочему дню: составление списка дел на завтра, выбор одежды, в которой завтра нужно пойти на встречу, и другие дела',
    priority: 'medium',
    durationMinutes: 30,  
    startMinute: 45, 
  },
  // {
  //   id: 'task13',
  //   time: '10:00',
  //   day: 5,
  //   content: 'Подготовка к завтрашнему рабочему дню: составление списка дел на завтра, выбор одежды, в которой завтра нужно пойти на встречу, и другие дела',
  //   priority: 'medium',
  //   durationMinutes: 30,  
  //   startMinute: 45, 
  // },
];

const getOverlappingTasks = (tasks: Cell[]): Cell[][] => {
  const groups: Cell[][] = [];
  
  tasks.forEach(task => {
    const taskStart = (parseInt(task.time.split(':')[0]) * 60) + (task.startMinute || 0);
    const taskEnd = taskStart + task.durationMinutes;
    
    let addedToGroup = false;
    
    for (const group of groups) {
      const groupHasOverlap = group.some(groupTask => {
        const groupStart = (parseInt(groupTask.time.split(':')[0]) * 60) + (groupTask.startMinute || 0);
        const groupEnd = groupStart + groupTask.durationMinutes;
        
        return (taskStart < groupEnd && taskEnd > groupStart);
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

const getTaskPosition = (task: Cell, overlappingGroup: Cell[], taskIndex: number) => {
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

const TaskBlock: React.FC<{ task: Cell; width: string; left: string; taskCount: number }> = ({ 
  task, 
  width, 
  left, 
  taskCount 
}) => {
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

  const getTextSettings = () => {
    switch (taskCount) {
      case 1:
        return { fontSize: '12px', lineClamp: Math.max(1, Math.floor(totalHeight / 15)) };
      case 2:
        return { fontSize: '11px', lineClamp: Math.max(1, Math.floor(totalHeight / 12)) };
      case 3:
        return { fontSize: '11px', lineClamp: Math.max(1, Math.floor(totalHeight / 10)) };
      case 4:
        return { fontSize: '10px', lineClamp: Math.max(1, Math.floor(totalHeight / 8)) };
      case 5:
        return { fontSize: '9px', lineClamp: Math.max(1, Math.floor(totalHeight / 6)) };
      default:
        return { fontSize: '9px', lineClamp: Math.max(1, Math.floor(totalHeight / 6)) };
    }
  };

  const textSettings = getTextSettings();

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
        opacity: 0.95,
        minHeight: '15px',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: '2px',
        boxSizing: 'border-box',
        padding: '1px',
      }}
    >
      <div className={`task-text ${textColor}`} style={{
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

                const overlappingGroups = getOverlappingTasks(tasksInThisSlot);

                return (
                  <div key={dayIndex} className="cell empty" style={{ 
                    position: 'relative',
                    minHeight: '60px',
                    height: '60px'
                  }}>
                    <span className="plus">+</span>
                    
                    {overlappingGroups.map((group, groupIndex) =>
                      group.map((task, taskIndex) => {
                        const position = getTaskPosition(task, group, taskIndex);
                        return (
                          <TaskBlock 
                            key={task.id} 
                            task={task} 
                            width={position.width}
                            left={position.left}
                            taskCount={group.length}
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
    </div>
  );
};