import React from 'react';
import type { Task } from '../../../../entities/task/model/types';
import { TaskBlock } from './TaskBlock';
import { getTaskPosition } from './TaskBlock.utils';

interface TaskBlockGroupProps {
  group: Task[];
  onTaskClick: (task: Task, event: React.MouseEvent) => void;
}

export const TaskBlockGroup: React.FC<TaskBlockGroupProps> = ({
  group,
  onTaskClick
}) => {
  return (
    <>
      {group.map((task, taskIndex) => {
        const position = getTaskPosition(task, group, taskIndex);
        return (
          <TaskBlock
            key={task.id}
            task={task}
            width={position.width}
            left={position.left}
            taskCount={group.length}
            onTaskClick={onTaskClick}
          />
        );
      })}
    </>
  );
};