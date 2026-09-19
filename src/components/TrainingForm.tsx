import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  trainingSchema,
  type TrainingFormData,
  type TrainingFormInput,
} from '../schemas/trainingSchema';

import type { Training } from '../types/training';

interface TrainingFormProps {
  training?: Training;
  onSubmit: (data: TrainingFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}

function TrainingForm({
  training,
  onSubmit,
  onCancel,
  isLoading = false,
  error,
}: TrainingFormProps) {
  const isEditing = !!training;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<TrainingFormInput, unknown, TrainingFormData>({
    resolver: zodResolver(trainingSchema),

    defaultValues: {
      name: '',
      category: '',
      instructor: '',
      startDate: '',
      endDate: '',
      maxSlots: 1,
      status: 'programada',
    },
  });

  useEffect(() => {
    if (training) {
      reset({
        name: training.name,
        category: training.category,
        instructor: training.instructor,
        startDate: training.startDate,
        endDate: training.endDate,
        maxSlots: training.maxSlots,
        status: training.status,
      });
    } else {
      reset({
        name: '',
        category: '',
        instructor: '',
        startDate: '',
        endDate: '',
        maxSlots: 1,
        status: 'programada',
      });
    }
  }, [training, reset]);

  const submit = async (data: TrainingFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Nombre
        </label>

        <input
          type="text"
          {...register('name')}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nombre de la capacitación"
          disabled={isLoading}
        />

        {errors.name && (
          <p className="text-red-500 text-xs mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Categoría
        </label>

        <input
          type="text"
          {...register('category')}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej. Tecnología"
          disabled={isLoading}
        />

        {errors.category && (
          <p className="text-red-500 text-xs mt-1">
            {errors.category.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Instructor
        </label>

        <input
          type="text"
          {...register('instructor')}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nombre del instructor"
          disabled={isLoading}
        />

        {errors.instructor && (
          <p className="text-red-500 text-xs mt-1">
            {errors.instructor.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Fecha de inicio
          </label>

          <input
            type="date"
            {...register('startDate')}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />

          {errors.startDate && (
            <p className="text-red-500 text-xs mt-1">
              {errors.startDate.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Fecha de finalización
          </label>

          <input
            type="date"
            {...register('endDate')}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />

          {errors.endDate && (
            <p className="text-red-500 text-xs mt-1">
              {errors.endDate.message}
            </p>
          )}
        </div>

      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Cupos máximos
        </label>

        <input
          type="number"
          min="1"
          {...register('maxSlots')}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />

        {errors.maxSlots && (
          <p className="text-red-500 text-xs mt-1">
            {errors.maxSlots.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Estado
        </label>

        <select
          {...register('status')}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          <option value="programada">Programada</option>
          <option value="en_curso">En curso</option>
          <option value="finalizada">Finalizada</option>
          <option value="cancelada">Cancelada</option>
        </select>

        {errors.status && (
          <p className="text-red-500 text-xs mt-1">
            {errors.status.message}
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm">
            {error}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">

        <button
          type="button"
          onClick={() => {
            if (isDirty) {
              const confirmed = confirm(
                'Tienes cambios sin guardar. ¿Deseas cancelar?'
              );

              if (!confirmed) return;
            }

            onCancel();
          }}
          disabled={isLoading}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-brand-800 hover:bg-brand-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {isLoading
            ? 'Guardando...'
            : isEditing
              ? 'Actualizar capacitación'
              : 'Crear capacitación'}
        </button>

      </div>
    </form>
  );
}

export default TrainingForm;