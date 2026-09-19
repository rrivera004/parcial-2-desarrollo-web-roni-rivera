import { apiClient } from './api';
import type {
  Training,
  CreateTrainingDto,
  UpdateTrainingDto,
} from '../types/training';

export const trainingService = {
  getAll: async (): Promise<Training[]> => {
    const response = await apiClient.get<Training[]>('/trainings');
    return response.data;
  },

  getById: async (id: number): Promise<Training> => {
    const response = await apiClient.get<Training>(`/trainings/${id}`);
    return response.data;
  },

  create: async (data: CreateTrainingDto): Promise<Training> => {
    const response = await apiClient.post<Training>('/trainings', data);
    return response.data;
  },

  update: async (
    id: number,
    data: UpdateTrainingDto
  ): Promise<Training> => {
    const response = await apiClient.patch<Training>(
      `/trainings/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/trainings/${id}`);
  },
};