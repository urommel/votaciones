import { useState, useCallback } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { motion } from 'framer-motion';
import { EventoModal } from '@/Components/Eventos/EventoModal';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import debounce from 'lodash/debounce';
import { ConfirmDialog } from '@/Components/ui/ConfirmDialog';
import { Badge } from '@/Components/ui/badge';

interface Evento {
  id: number;
  nombre: string;
  descripcion: string | null;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: 'programado' | 'en_curso' | 'finalizado' | 'cancelado';
  ubicacion: string | null;
  created_at: string;
}

interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
}

interface Props {
  eventos: PaginatedData<Evento>;
  filters: {
    search: string;
  };
  estados: string[];
}

export default function Eventos({ eventos, filters, estados }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventoToDelete, setEventoToDelete] = useState<Evento | null>(null);
  
  const { delete: destroy } = useForm({});

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      router.get(
        route('eventos.index'),
        { search: query },
        { preserveState: true, preserveScroll: true }
      );
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handlePageChange = (page: number) => {
    router.get(
      route('eventos.index', { page }),
      { search: searchTerm },
      { preserveState: true }
    );
  };

  const handleDeleteClick = (evento: Evento) => {
    setEventoToDelete(evento);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (eventoToDelete) {
      destroy(route('eventos.destroy', eventoToDelete.id));
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'programado':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Programado</Badge>;
      case 'en_curso':
        return <Badge className="bg-green-100 text-green-800 border-green-200">En Curso</Badge>;
      case 'finalizado':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Finalizado</Badge>;
      case 'cancelado':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelado</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{estado}</Badge>;
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Eventos" />
      
      <div className="p-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Eventos</h1>
            <p className="mt-1 text-gray-500">Gestiona los eventos y actividades</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-[300px] pl-10"
              />
              <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            </div>
            <Button 
              onClick={() => {
                setEditingEvento(null);
                setIsModalOpen(true);
              }}
              className="gap-2 bg-theme-verde hover:bg-theme-verde/90"
            >
              <PlusIcon className="w-5 h-5" />
              Nuevo Evento
            </Button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white shadow-sm rounded-xl"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Horario
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {eventos.data.map((evento, index) => (
                  <motion.tr 
                    key={evento.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50/50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {evento.nombre}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {format(new Date(evento.fecha), 'dd MMM yyyy', { locale: es })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {evento.hora_inicio} - {evento.hora_fin}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {evento.ubicacion || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      {getEstadoBadge(evento.estado)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <Button
                        onClick={() => {
                          setEditingEvento(evento);
                          setIsModalOpen(true);
                        }}
                        variant="ghost"
                        className="p-1 mr-2 bg-transparent hover:bg-blue-50 group"
                      >
                        <PencilIcon className="w-[18px] h-[18px] text-black group-hover:text-blue-600" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(evento)}
                        variant="ghost"
                        className="p-1 mr-2 bg-transparent hover:bg-red-50 group"
                      >
                        <TrashIcon className="w-[18px] h-[18px] text-black group-hover:text-red-600" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {eventos.last_page > 1 && (
            <div className="px-6 py-4 bg-white border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Mostrando {eventos.from} a {eventos.to} de {eventos.total} eventos
                </p>
                <div className="flex gap-2">
                  {eventos.links.map((link, i) => {
                    if (link.url === null) return null;

                    return (
                      <Button
                        key={i}
                        onClick={() => handlePageChange(Number(link.label))}
                        className={`${
                          link.active
                            ? 'bg-theme-verde border-theme-verde text-white hover:bg-theme-verde/90'
                            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        } w-10 h-10 p-0 font-medium`}
                        disabled={!link.url}
                      >
                        {link.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <EventoModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvento(null);
        }}
        evento={editingEvento}
        mode={editingEvento ? 'edit' : 'create'}
        estados={estados}
      />

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar eliminación"
        message={`¿Estás seguro que deseas eliminar el evento ${eventoToDelete?.nombre}? Esta acción no se puede deshacer.`}
      />
    </AuthenticatedLayout>
  );
}
