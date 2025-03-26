import { useState, useCallback } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PlusIcon, TrashIcon, MagnifyingGlassIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { motion } from 'framer-motion';
import { AsistenciaModal } from '@/Components/Asistencias/AsistenciaModal';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import debounce from 'lodash/debounce';
import { ConfirmDialog } from '@/Components/ui/ConfirmDialog';
import { Select } from '@/Components/ui/select';
import { Badge } from '@/Components/ui/badge';

interface User {
  id: number;
  name: string;
}

interface Sediprano {
  id: number;
  user: User;
}

interface Evento {
  id: number;
  nombre: string;
}

interface Asistencia {
  id: number;
  sediprano_id: number;
  evento_id: number;
  hora_registro: string;
  estado: 'presente' | 'tardanza' | 'falta';
  observacion: string | null;
  sediprano: Sediprano;
  evento: Evento;
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
  asistencias: PaginatedData<Asistencia>;
  filters: {
    search: string;
    evento_id: number | null;
  };
  eventos: Evento[];
  sedipranos: Sediprano[];
}

export default function Asistencias({ asistencias, filters, eventos, sedipranos }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const [eventoFilter, setEventoFilter] = useState<string>(filters.evento_id ? filters.evento_id.toString() : '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsistencia, setEditingAsistencia] = useState<Asistencia | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [asistenciaToDelete, setAsistenciaToDelete] = useState<Asistencia | null>(null);
  
  const { delete: destroy } = useForm({});

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      router.get(
        route('asistencias.index'),
        { 
          search: query,
          evento_id: eventoFilter || null
        },
        { preserveState: true, preserveScroll: true }
      );
    }, 300),
    [eventoFilter]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleEventoFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEventoId = e.target.value;
    setEventoFilter(newEventoId);
    
    router.get(
      route('asistencias.index'),
      { 
        search: searchTerm,
        evento_id: newEventoId || null
      },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handlePageChange = (page: number) => {
    router.get(
      route('asistencias.index', { page }),
      { 
        search: searchTerm,
        evento_id: eventoFilter || null
      },
      { preserveState: true }
    );
  };

  const handleDeleteClick = (asistencia: Asistencia) => {
    setAsistenciaToDelete(asistencia);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (asistenciaToDelete) {
      destroy(route('asistencias.destroy', asistenciaToDelete.id));
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'presente':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Presente</Badge>;
      case 'tardanza':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Tardanza</Badge>;
      case 'falta':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Falta</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{estado}</Badge>;
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Asistencias" />
      
      <div className="p-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Asistencias</h1>
            <p className="mt-1 text-gray-500">Gestiona las asistencias a eventos</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Buscar asistencias..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-[300px] pl-10"
              />
              <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            </div>
            
            <Select
              value={eventoFilter}
              onChange={handleEventoFilterChange}
              className="w-[250px]"
            >
              <option value="">Todos los eventos</option>
              {eventos.map((evento) => (
                <option key={evento.id} value={evento.id}>
                  {evento.nombre}
                </option>
              ))}
            </Select>
            
            <Button 
              onClick={() => {
                setEditingAsistencia(null);
                setIsModalOpen(true);
              }}
              className="gap-2 bg-theme-amarillo hover:bg-theme-amarillo/90"
            >
              <PlusIcon className="w-5 h-5" />
              Registrar Asistencia
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
                    Sediprano
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Evento
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Fecha y Hora
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Observación
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {asistencias.data.map((asistencia, index) => (
                  <motion.tr 
                    key={asistencia.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50/50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {asistencia.sediprano.user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {asistencia.evento.nombre}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {format(new Date(asistencia.hora_registro), 'dd MMM yyyy HH:mm', { locale: es })}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      {getEstadoBadge(asistencia.estado)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {asistencia.observacion || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <Button
                        onClick={() => {
                          setEditingAsistencia(asistencia);
                          setIsModalOpen(true);
                        }}
                        variant="ghost"
                        className="p-1 mr-2 bg-transparent hover:bg-blue-50 group"
                      >
                        <PencilIcon className="w-[18px] h-[18px] text-black group-hover:text-blue-600" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(asistencia)}
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
          {asistencias.last_page > 1 && (
            <div className="px-6 py-4 bg-white border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Mostrando {asistencias.from} a {asistencias.to} de {asistencias.total} asistencias
                </p>
                <div className="flex gap-2">
                  {asistencias.links.map((link, i) => {
                    if (link.url === null) return null;

                    return (
                      <Button
                        key={i}
                        onClick={() => handlePageChange(Number(link.label))}
                        className={`${
                          link.active
                            ? 'bg-theme-amarillo border-theme-amarillo text-white hover:bg-theme-amarillo/90'
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

      <AsistenciaModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAsistencia(null);
        }}
        asistencia={editingAsistencia}
        mode={editingAsistencia ? 'edit' : 'create'}
        sedipranos={sedipranos}
        eventos={eventos}
      />

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar eliminación"
        message={`¿Estás seguro que deseas eliminar esta asistencia? Esta acción no se puede deshacer.`}
      />
    </AuthenticatedLayout>
  );
}
