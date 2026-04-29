import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "../../api/taskApi";

const getWeekRange = () => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay() + 1 - 14);
  const end = new Date(now);
  end.setDate(now.getDate() - now.getDay() + 1 + 14);

  const toISOString = (date: Date) =>
    date.toISOString().replace(/\.\d{3}Z$/, "");
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
    queryKey: ["tasks"],
    queryFn: () => taskApi.getTasks(),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const getTaskById = useMutation({
    mutationFn: async (taskId: string) => {
      return await taskApi.getTaskById(taskId);
    },
  });

  const {
    data: penaltyTasks = [],
    isLoading: isLoadingPenalty,
    refetch: refetchPenaltyTasks,
  } = useQuery({
    queryKey: ["penaltyTasks"],
    queryFn: () => taskApi.getPenaltyTasks(),
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60 * 5,
  });

  const createTask = useMutation({
    mutationFn: async (taskData: Parameters<typeof taskApi.createTask>[0]) => {
      await taskApi.createTask(taskData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["penaltyTasks"] });
    },
  });

  const updateTask = useMutation({
    mutationFn: async (taskData: Parameters<typeof taskApi.updateTask>[0]) => {
      await taskApi.updateTask(taskData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["penaltyTasks"] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      await taskApi.deleteTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["penaltyTasks"] });
    },
  });

  const completeTask = useMutation({
    mutationFn: async (taskId: string) => {
      await taskApi.completeTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["penaltyTasks"] });
    },
    onError: (error) => {
      console.error("Error in completeTask mutation:", error);
    },
  });

  const completeRepitTask = useMutation({
    mutationFn: async (params: { taskId: string; countFrom: number }) => {
      await taskApi.completeRepitTask(params.taskId, params.countFrom);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
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
    completeRepitTask: completeRepitTask.mutateAsync,
    getTaskById: getTaskById,
    isCreating: createTask.isPending,
    isUpdating: updateTask.isPending,
    isDeleting: deleteTask.isPending,
  };
};
