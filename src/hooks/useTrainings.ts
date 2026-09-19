import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { trainingService } from '../services/trainingService';

import type {
  CreateTrainingDto,
  UpdateTrainingDto,
} from '../types/training';

export const trainingKeys = {
  all: ['trainings'] as const,
  list: ['trainings', 'list'] as const,
  detail: (id: number) => ['trainings', id] as const,
};

export function useTrainings() {
  return useQuery({
    queryKey: trainingKeys.list,
    queryFn: trainingService.getAll,
  });
}

export function useTraining(id: number | null) {
  return useQuery({
    queryKey: trainingKeys.detail(id!),
    queryFn: () => trainingService.getById(id!),
    enabled: !!id,
  });
}

export function useCreateTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTrainingDto) =>
      trainingService.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trainingKeys.all,
      });
    },
  });
}

export function useUpdateTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateTrainingDto;
    }) => trainingService.update(id, data),

    onSuccess: (training) => {
      queryClient.setQueryData(
        trainingKeys.detail(training.id),
        training
      );

      queryClient.invalidateQueries({
        queryKey: trainingKeys.all,
      });
    },
  });
}

export function useDeleteTraining() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      trainingService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trainingKeys.all,
      });
    },
  });
}