// src/shared/lib/hooks/useTasks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../../api/taskApi';

const USER_ID = 1; // захардкожен
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

  const getTaskById = useMutation({
    mutationFn: async (taskId: string) => {
      return await taskApi.getTaskById(taskId);
    },
  });

  const createTask = useMutation({
    mutationFn: async (taskData: Parameters<typeof taskApi.createTask>[0]) => {
      await taskApi.createTask(taskData, USER_ID);
      const { startTimeTable, endDateTime } = getWeekRange();
      await taskApi.rebuildTimeTable(USER_ID, startTimeTable, endDateTime);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', USER_ID] });
    },
  });

  const updateTask = useMutation({
    mutationFn: async (taskData: Parameters<typeof taskApi.updateTask>[0]) => {
      await taskApi.updateTask(taskData);
      const { startTimeTable, endDateTime } = getWeekRange();
      await taskApi.rebuildTimeTable(USER_ID, startTimeTable, endDateTime);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', USER_ID] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      await taskApi.deleteTask(taskId);
      const { startTimeTable, endDateTime } = getWeekRange();
      await taskApi.rebuildTimeTable(USER_ID, startTimeTable, endDateTime);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', USER_ID] });
    },
  });

  const completeTask = useMutation({
    mutationFn: async (taskId: string) => {
      await taskApi.completeTask(taskId);
      const { startTimeTable, endDateTime } = getWeekRange();
      await taskApi.rebuildTimeTable(USER_ID, startTimeTable, endDateTime);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', USER_ID] });
    },
  });

  const completeRepitTask = useMutation({
    mutationFn: async (params: { taskId: string; countFrom: number }) => {
      await taskApi.completeRepitTask(params.taskId, params.countFrom);
      const { startTimeTable, endDateTime } = getWeekRange();
      await taskApi.rebuildTimeTable(USER_ID, startTimeTable, endDateTime);
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
    completeRepitTask: completeRepitTask.mutateAsync,
    getTaskById: getTaskById,
    isCreating: createTask.isPending,
    isUpdating: updateTask.isPending,
    isDeleting: deleteTask.isPending,
  };
};