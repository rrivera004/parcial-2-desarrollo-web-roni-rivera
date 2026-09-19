import { useCallback, useMemo, useState } from 'react';
import type { Training, TrainingStatus } from '../types/training';
import TrainingCard from '../components/TrainingCard';
import TrainingForm from '../components/TrainingForm';
import StatsBadge from '../components/StatsBadge';
import FormField from '../components/FormField';
import Modal from '../components/Modal';

import {
  useTrainings,
  useCreateTraining,
  useUpdateTraining,
  useDeleteTraining,
} from '../hooks/useTrainings';

import type { TrainingFormData } from '../schemas/trainingSchema';

const formFieldClass =
  'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

const statuses: TrainingStatus[] = [
  'programada',
  'en_curso',
  'finalizada',
  'cancelada',
];

const statusLabels: Record<TrainingStatus, string> = {
  programada: 'Programada',
  en_curso: 'En curso',
  finalizada: 'Finalizada',
  cancelada: 'Cancelada',
};

function TrainingsPage() {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] =
    useState<TrainingStatus | ''>('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTraining, setEditingTraining] =
    useState<Training | undefined>();

  const [selectedTraining, setSelectedTraining] =
    useState<Training | undefined>();

  const [submitError, setSubmitError] =
    useState<string | null>(null);

  const {
    data: trainings = [],
    isLoading,
    isError,
    error,
  } = useTrainings();

  const createTraining = useCreateTraining();
  const updateTraining = useUpdateTraining();
  const deleteTraining = useDeleteTraining();

  const filteredTrainings = useMemo(() => {
    const text = search.toLowerCase().trim();

    return trainings.filter((training) => {
      const matchesSearch =
        !text ||
        training.name.toLowerCase().includes(text) ||
        training.category.toLowerCase().includes(text) ||
        training.instructor.toLowerCase().includes(text);

      const matchesStatus =
        !selectedStatus ||
        training.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [trainings, search, selectedStatus]);

  const totalTrainings = trainings.length;

  const inProgressTrainings = trainings.filter(
    (training) => training.status === 'en_curso'
  ).length;

  const completedTrainings = trainings.filter(
    (training) => training.status === 'finalizada'
  ).length;

  const handleSelectTraining = useCallback(
    (training: Training) => {
      setSelectedTraining(training);
    },
    []
  );

  const handleOpenCreate = useCallback(() => {
    setEditingTraining(undefined);
    setSubmitError(null);
    setModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback(
    (training: Training) => {
      setEditingTraining(training);
      setSubmitError(null);
      setModalOpen(true);
    },
    []
  );

  const handleDeleteTraining = useCallback(
    (id: number) => {
      if (
        !confirm(
          '¿Estás seguro de eliminar esta capacitación?'
        )
      ) {
        return;
      }

      deleteTraining.mutate(id);
    },
    [deleteTraining]
  );

  const handleSubmit = useCallback(
    async (formData: TrainingFormData) => {
      setSubmitError(null);

      try {
        if (editingTraining) {
          await updateTraining.mutateAsync({
            id: editingTraining.id,
            data: formData,
          });
        } else {
          await createTraining.mutateAsync(formData);
        }

        setModalOpen(false);
        setEditingTraining(undefined);
      } catch {
        setSubmitError(
          'No se pudo guardar la capacitación. Intenta de nuevo.'
        );
      }
    },
    [
      editingTraining,
      createTraining,
      updateTraining,
    ]
  );

  const closeDetails = () => {
    setSelectedTraining(undefined);
  };

  return (
    <div className="p-6">

      {/* Encabezado */}
      <div className="mb-6 flex justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Gestión de Capacitaciones
          </h2>

          <p className="text-slate-500 mt-1">
            {isLoading
              ? 'Cargando...'
              : `${filteredTrainings.length} de ${totalTrainings} capacitaciones`}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-brand-800 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          + Nueva capacitación
        </button>
      </div>

      {/* Estadísticas */}
      <div className="flex flex-wrap gap-4 mb-6">
        <StatsBadge
          label="Total de capacitaciones"
          value={totalTrainings}
          variant="blue"
        />

        <StatsBadge
          label="En curso"
          value={inProgressTrainings}
          variant="yellow"
        />

        <StatsBadge
          label="Finalizadas"
          value={completedTrainings}
          variant="green"
        />
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-wrap items-end gap-3">

        <FormField
          label="Buscar"
          className="flex-1 min-w-[220px]"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, categoría o instructor..."
            className={formFieldClass}
          />
        </FormField>

        <FormField
          label="Estado"
          className="min-w-[180px]"
        >
          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(
                e.target.value as TrainingStatus | ''
              )
            }
            className={formFieldClass}
          >
            <option value="">Todos los estados</option>

            {statuses.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </FormField>

        {(search || selectedStatus) && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedStatus('');
            }}
            className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-sm transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mr-3" />

          <span>
            Cargando capacitaciones...
          </span>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium">
            Error al cargar las capacitaciones
          </p>

          <p className="text-red-500 text-sm mt-1">
            {(error as Error)?.message ||
              'Error desconocido'}
          </p>
        </div>
      )}

      {/* Sin resultados */}
      {!isLoading &&
        !isError &&
        filteredTrainings.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p>
              No se encontraron capacitaciones con los filtros aplicados.
            </p>
          </div>
        )}

      {/* Tarjetas */}
      {!isLoading &&
        !isError &&
        filteredTrainings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTrainings.map((training) => (
              <div
                key={training.id}
                className="relative"
              >
                <TrainingCard
                  training={training}
                  onSelect={handleSelectTraining}
                  onEdit={handleOpenEdit}
                  onDelete={handleDeleteTraining}
                />
              </div>
            ))}
          </div>
        )}

      {/* Modal crear / editar */}
      <Modal
        isOpen={modalOpen}
        title={
          editingTraining
            ? `Editar: ${editingTraining.name}`
            : 'Nueva capacitación'
        }
        onClose={() => setModalOpen(false)}
      >
        <TrainingForm
          training={editingTraining}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          isLoading={
            createTraining.isPending ||
            updateTraining.isPending
          }
          error={submitError}
        />
      </Modal>

      {/* Detalle */}
      {selectedTraining && (
        <div className="fixed inset-0 z-50 bg-slate-100 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 py-6">

            <button
              type="button"
              onClick={closeDetails}
              className="mb-4 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              ← Volver
            </button>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200">

              <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-6 py-7">
                <h2 className="text-2xl font-bold">
                  Detalle de la capacitación
                </h2>

                <p className="mt-1 text-blue-100">
                  Información general de la capacitación
                </p>
              </div>

              <div className="p-6">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Nombre
                    </p>

                    <p className="font-semibold text-slate-900 mt-1">
                      {selectedTraining.name}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Categoría
                    </p>

                    <p className="font-semibold text-slate-900 mt-1">
                      {selectedTraining.category}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Instructor
                    </p>

                    <p className="font-semibold text-slate-900 mt-1">
                      {selectedTraining.instructor}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Cupos máximos
                    </p>

                    <p className="font-semibold text-slate-900 mt-1">
                      {selectedTraining.maxSlots}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Fecha de inicio
                    </p>

                    <p className="font-semibold text-slate-900 mt-1">
                      {selectedTraining.startDate}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Fecha de finalización
                    </p>

                    <p className="font-semibold text-slate-900 mt-1">
                      {selectedTraining.endDate}
                    </p>
                  </div>

                </div>

                <div className="mt-4 bg-blue-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500">
                    Estado
                  </p>

                  <p className="font-semibold text-blue-700 mt-1">
                    {statusLabels[selectedTraining.status]}
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default TrainingsPage;