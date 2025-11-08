import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task } from '../../../entities/task/model/types';
import { taskApi } from '../../api/taskApi';

const USER_ID = 1;

export const useTasks = () => {
  const queryClient = useQueryClient();

  const { 
    data: tasks = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['tasks', USER_ID],
    queryFn: () => taskApi.getTasks(USER_ID),
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 минут
  });

  // Мутация для создания задачи
  const createTaskMutation = useMutation({
    mutationFn: (taskData: Partial<Task>) => taskApi.createTask(taskData, USER_ID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', USER_ID] });
    },
    onError: (error: Error) => {
      console.error('Error creating task:', error);
    },
  });

  // Мутация для обновления задачи
  const updateTaskMutation = useMutation({
    mutationFn: taskApi.updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', USER_ID] });
    },
    onError: (error: Error) => {
      console.error('Error updating task:', error);
    },
  });

  // Мутация для удаления задачи
  const deleteTaskMutation = useMutation({
    mutationFn: taskApi.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', USER_ID] });
    },
    onError: (error: Error) => {
      console.error('Error deleting task:', error);
    },
  });

  // Мутация для отметки выполнения задачи
  const completeTaskMutation = useMutation({
    mutationFn: taskApi.completeTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', USER_ID] });
    },
    onError: (error: Error) => {
      console.error('Error completing task:', error);
    },
  });

  return {
    tasks,
    isLoading,
    error,
    refetch,
    createTask: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync,
    completeTask: completeTaskMutation.mutateAsync,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
    isCompleting: completeTaskMutation.isPending,
    createError: createTaskMutation.error,
    updateError: updateTaskMutation.error,
    deleteError: deleteTaskMutation.error,
    completeError: completeTaskMutation.error,
  };
};