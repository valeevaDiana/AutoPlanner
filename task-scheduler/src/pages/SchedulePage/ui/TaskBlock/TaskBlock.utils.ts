import type { Task } from '../../../../entities/task/model/types';

export const getOverlappingTasks = (tasks: Task[]): Task[][] => {
  const groups: Task[][] = [];

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

export const getTaskPosition = (task: Task, overlappingGroup: Task[], taskIndex: number) => {
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

export const getTextSettings = (taskCount: number, totalHeight: number) => {
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