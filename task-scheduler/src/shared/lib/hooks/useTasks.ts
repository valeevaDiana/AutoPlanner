import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../../api/taskApi';

const getWeekRange = () => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay() + 1 - 14); // 2 недели назад от понедельника

    const end = new Date(now);
    end.setDate(now.getDate() - now.getDay() + 1 + 14); // 2 недели вперёд

    // Форматируем в ISO без миллисекунд и с Z
    const toISOString = (date: Date) => date.toISOString().replace(/\.\d{3}Z$/, 'Z');

    return {
      startTimeTable: toISOString(start),
      endDateTime: toISOString(end),
    };
  };


export const useTasks = (userId?: number) => {

  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['tasks', userId],
    queryFn: () => {
      return userId ? taskApi.getTasks(userId) : Promise.resolve([]);
    },

    enabled: !!userId, 
    staleTime: 1000 * 60 * 5, 
    retry: 2,
  });

  const {
    data: penaltyTasks = [],
    isLoading: isLoadingPenalty,
    refetch: refetchPenaltyTasks,
  } = useQuery({
    queryKey: ['penaltyTasks', userId],
    queryFn: () => userId ? taskApi.getPenaltyTasks(userId) : Promise.resolve([]),
    enabled: !!userId,
    staleTime: 1000 * 30, 
    refetchInterval: 1000 * 60 * 5, 
  });

  const createTask = useMutation({
    mutationFn: async (taskData: Parameters<typeof taskApi.createTask>[0]) => {
      if (!userId) throw new Error('User not authenticated');
      await taskApi.createTask(taskData, userId);
      const { startTimeTable, endDateTime } = getWeekRange();
      await taskApi.rebuildTimeTable(userId, startTimeTable, endDateTime);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
      queryClient.invalidateQueries({ queryKey: ['penaltyTasks', userId] });
    },
  });

  const updateTask = useMutation({
    mutationFn: async (taskData: Parameters<typeof taskApi.updateTask>[0]) => {
      if (!userId) throw new Error('User not authenticated');
      await taskApi.updateTask(taskData);
      const { startTimeTable, endDateTime } = getWeekRange();
      await taskApi.rebuildTimeTable(userId, startTimeTable, endDateTime);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
      queryClient.invalidateQueries({ queryKey: ['penaltyTasks', userId] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      if (!userId) throw new Error('User not authenticated');
      await taskApi.deleteTask(taskId);
      const { startTimeTable, endDateTime } = getWeekRange();
      await taskApi.rebuildTimeTable(userId, startTimeTable, endDateTime);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
      queryClient.invalidateQueries({ queryKey: ['penaltyTasks', userId] });
    },
  });

  const completeTask = useMutation({
    mutationFn: async (taskId: string) => {
      if (!userId) throw new Error('User not authenticated');
      await taskApi.completeTask(taskId);
      const { startTimeTable, endDateTime } = getWeekRange();
      await taskApi.rebuildTimeTable(userId, startTimeTable, endDateTime);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
      queryClient.invalidateQueries({ queryKey: ['penaltyTasks', userId] });
    },
    onError: (error) => {
      console.error('Error in completeTask mutation:', error);
    },

  });

  return {
    tasks,
    penaltyTasks,
    isLoading,
    isLoadingPenalty,
    error,
    refetch,
    refetchPenaltyTasks,
    createTask: createTask.mutateAsync,
    updateTask: updateTask.mutateAsync,
    deleteTask: deleteTask.mutateAsync,
    completeTask: completeTask.mutateAsync,
    isCreating: createTask.isPending,
    isUpdating: updateTask.isPending,
    isDeleting: deleteTask.isPending,
  };
};