import { z } from 'zod';

export const trainingSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  category: z.string().min(2, 'Mínimo 2 caracteres'),
  instructor: z.string().min(2, 'Mínimo 2 caracteres'),
  startDate: z.string().min(1, 'La fecha de inicio es requerida'),
  endDate: z.string().min(1, 'La fecha de finalización es requerida'),
  maxSlots: z.coerce.number().min(1, 'Debe existir al menos 1 cupo'),
  status: z.enum([
    'programada',
    'en_curso',
    'finalizada',
    'cancelada',
  ]),
});

export type TrainingFormData = z.infer<typeof trainingSchema>;
export type TrainingFormInput = z.input<typeof trainingSchema>;