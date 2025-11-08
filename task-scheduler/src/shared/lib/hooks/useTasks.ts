// src/shared/lib/hooks/useTasks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../../api/taskApi';

const USER_ID = 1; // захардкожен

export const useTasks = () => {
  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['tasks', USER_ID],
    queryFn: () => taskApi.getTasks(USER_ID),
    staleTime: 1000 * 60 * 5, 
    retry: 2,
  });

  const createTask = useMutation({
    mutationFn: async (taskData: Parameters<typeof taskApi.createTask>[0]) => {
      await taskApi.createTask(taskData, USER_ID);
      await taskApi.rebuildTimeTable(USER_ID);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', USER_ID] });
    },
  });

  const updateTask = useMutation({
    mutationFn: async (taskData: Parameters<typeof taskApi.updateTask>[0]) => {
      await taskApi.updateTask(taskData);
      await taskApi.rebuildTimeTable(USER_ID); 
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', USER_ID] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      await taskApi.deleteTask(taskId);
      await taskApi.rebuildTimeTable(USER_ID); 
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', USER_ID] });
    },
  });

  const completeTask = useMutation({
    mutationFn: async (taskId: string) => {
      await taskApi.completeTask(taskId);
      await taskApi.rebuildTimeTable(USER_ID);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', USER_ID] });
    },
  });

  return {
    tasks,
    isLoading,
    error,
    refetch,
    createTask: createTask.mutateAsync,
    updateTask: updateTask.mutateAsync,
    deleteTask: deleteTask.mutateAsync,
    completeTask: completeTask.mutateAsync,
    isCreating: createTask.isPending,
    isUpdating: updateTask.isPending,
    isDeleting: deleteTask.isPending,
  };
};