import { useState, useCallback } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PlusIcon, TrashIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { motion } from 'framer-motion';
import { VotoModal } from '@/Components/Votos/VotoModal';
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

interface Candidato {
  id: number;
  sediprano: Sediprano;
  cargo: {
    id: number;
    nombre: string;
  };
  area: {
    id: number;
    nombre: string;
    abreviatura: string;
  } | null;
}

interface Votacion {
  id: number;
  name: string;
}

interface Voto {
  id: number;
  sediprano_id: number;
  candidato_id: number | null;
  votacion_id: number;
  es_blanco: boolean;
  fecha_voto: string;
  sediprano: Sediprano;
  candidato: Candidato | null;
  votacion: Votacion;
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
  votos: PaginatedData<Voto>;
  filters: {
    search: string;
    votacion_id: number | null;
  };
  votaciones: Votacion[];
  sedipranos: Sediprano[];
  candidatos: Candidato[];
}

export default function Votos({ votos, filters, votaciones, sedipranos, candidatos }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const [votacionFilter, setVotacionFilter] = useState<string>(filters.votacion_id ? filters.votacion_id.toString() : '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [votoToDelete, setVotoToDelete] = useState<Voto | null>(null);
  
  const { delete: destroy } = useForm({});

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      router.get(
        route('votos.index'),
        { 
          search: query,
          votacion_id: votacionFilter || null
        },
        { preserveState: true, preserveScroll: true }
      );
    }, 300),
    [votacionFilter]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleVotacionFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVotacionId = e.target.value;
    setVotacionFilter(newVotacionId);
    
    router.get(
      route('votos.index'),
      { 
        search: searchTerm,
        votacion_id: newVotacionId || null
      },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handlePageChange = (page: number) => {
    router.get(
      route('votos.index', { page }),
      { 
        search: searchTerm,
        votacion_id: votacionFilter || null
      },
      { preserveState: true }
    );
  };

  const handleDeleteClick = (voto: Voto) => {
    setVotoToDelete(voto);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (votoToDelete) {
      destroy(route('votos.destroy', votoToDelete.id));
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Votos" />
      
      <div className="p-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Votos</h1>
            <p className="mt-1 text-gray-500">Gestiona los votos registrados en el sistema</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Buscar votos..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-[300px] pl-10"
              />
              <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            </div>
            
            <Select
              value={votacionFilter}
              onChange={handleVotacionFilterChange}
              className="w-[250px]"
            >
              <option value="">Todas las votaciones</option>
              {votaciones.map((votacion) => (
                <option key={votacion.id} value={votacion.id}>
                  {votacion.name}
                </option>
              ))}
            </Select>
            
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="gap-2 !bg-theme-cyan hover:!bg-theme-cyan/90"
            >
              <PlusIcon className="w-5 h-5" />
              Registrar Voto
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
                    Votación
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Voto
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Fecha y Hora
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {votos.data.map((voto, index) => (
                  <motion.tr 
                    key={voto.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50/50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {voto.sediprano.user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {voto.votacion.name}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      {voto.es_blanco ? (
                        <Badge className="bg-gray-100 text-gray-800">Voto en Blanco</Badge>
                      ) : (
                        <span>
                          {voto.candidato?.sediprano.user.name} 
                          {voto.candidato?.cargo ? ` (${voto.candidato.cargo.nombre})` : ''}
                          {voto.candidato?.area ? ` - ${voto.candidato.area.abreviatura}` : ''}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {format(new Date(voto.fecha_voto), 'dd MMM yyyy HH:mm', { locale: es })}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <Button
                        onClick={() => handleDeleteClick(voto)}
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
          {votos.last_page > 1 && (
            <div className="px-6 py-4 bg-white border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Mostrando {votos.from} a {votos.to} de {votos.total} votos
                </p>
                <div className="flex gap-2">
                  {votos.links.map((link, i) => {
                    if (link.url === null) return null;

                    return (
                      <Button
                        key={i}
                        onClick={() => handlePageChange(Number(link.label))}
                        className={`${
                          link.active
                            ? 'bg-theme-cyan border-theme-cyan text-white hover:bg-theme-cyan/90'
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

      <VotoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sedipranos={sedipranos}
        candidatos={candidatos}
        votaciones={votaciones}
      />

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar eliminación"
        message={`¿Estás seguro que deseas eliminar este voto? Esta acción no se puede deshacer.`}
      />
    </AuthenticatedLayout>
  );
}
