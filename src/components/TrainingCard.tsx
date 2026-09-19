import type { Training } from '../types/training';

interface TrainingCardProps {
  training: Training;
  onSelect?: (training: Training) => void;
  onEdit?: (training: Training) => void;
  onDelete?: (id: number) => void;
}

const statusConfig = {
  programada: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    label: 'Programada',
  },
  en_curso: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    label: 'En curso',
  },
  finalizada: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    label: 'Finalizada',
  },
  cancelada: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    label: 'Cancelada',
  },
};

function TrainingCard({
  training,
  onSelect,
  onEdit,
  onDelete,
}: TrainingCardProps) {
  const statusStyle = statusConfig[training.status];

  return (
    <div
      onClick={() => onSelect?.(training)}
      className={`
        bg-white rounded-xl border border-slate-200 p-5 w-full
        hover:shadow-md hover:border-blue-300
        transition-all duration-200
        ${onSelect ? 'cursor-pointer' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900 truncate">
            {training.name}
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            {training.category}
          </p>
        </div>

        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${statusStyle.bg} ${statusStyle.text}`}
        >
          {statusStyle.label}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p>
          <span className="font-medium">Instructor:</span>{' '}
          {training.instructor}
        </p>

        <p>
          <span className="font-medium">Inicio:</span>{' '}
          {training.startDate}
        </p>

        <p>
          <span className="font-medium">Fin:</span>{' '}
          {training.endDate}
        </p>

        <p>
          <span className="font-medium">Cupos:</span>{' '}
          {training.maxSlots}
        </p>
      </div>

      <div
        className="mt-4 flex gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(training)}
            className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
          >
            Editar
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(training.id)}
            className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium"
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
}

export default TrainingCard;