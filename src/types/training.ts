// src/types/training.ts

export type TrainingStatus =
  | 'programada'
  | 'en_curso'
  | 'finalizada'
  | 'cancelada';

export interface Training {
  id: number;
  name: string;
  category: string;
  instructor: string;
  startDate: string;
  endDate: string;
  maxSlots: number;
  status: TrainingStatus;
}

export type CreateTrainingDto = Omit<Training, 'id'>;

export type UpdateTrainingDto = Partial<CreateTrainingDto>;