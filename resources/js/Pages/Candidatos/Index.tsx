import { useState, useCallback } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { motion } from 'framer-motion';
import { CandidatoModal } from '@/Components/Candidatos/CandidatoModal';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import debounce from 'lodash/debounce';
import { ConfirmDialog } from '@/Components/ui/ConfirmDialog';

interface User {
  id: number;
  name: string;
}

interface Sediprano {
  id: number;
  codigo: number;
  primer_apellido: string;
  segundo_apellido: string;
  user: User;
}

interface Cargo {
  id: number;
  nombre: string;
}

interface Area {
  id: number;
  nombre: string;
  abreviatura: string;
}

interface Votacion {
  id: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
}

interface Candidato {
  id: number;
  sediprano_id: number;
  cargo_id: number;
  area_id: number | null;
  votacion_id: number;
  foto: string | null;
  created_at: string;
  sediprano: Sediprano;
  cargo: Cargo;
  area: Area | null;
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
  candidatos: PaginatedData<Candidato>;
  filters: {
    search: string;
  };
  sedipranos: Sediprano[];
  cargos: Cargo[];
  areas: Area[];
  votaciones: Votacion[];
}

export default function Candidatos({ candidatos, filters, sedipranos, cargos, areas, votaciones }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCandidato, setEditingCandidato] = useState<Candidato | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [candidatoToDelete, setCandidatoToDelete] = useState<Candidato | null>(null);
  
  const { delete: destroy } = useForm({});

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      router.get(
        route('candidatos.index'),
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
      route('candidatos.index', { page }),
      { search: searchTerm },
      { preserveState: true }
    );
  };

  const handleDeleteClick = (candidato: Candidato) => {
    setCandidatoToDelete(candidato);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (candidatoToDelete) {
      destroy(route('candidatos.destroy', candidatoToDelete.id));
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Candidatos" />
      
      <div className="p-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Candidatos</h1>
            <p className="mt-1 text-gray-500">Gestiona los candidatos para las elecciones</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Buscar candidatos..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-[300px] pl-10"
              />
              <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            </div>
            <Button 
              onClick={() => {
                setEditingCandidato(null);
                setIsModalOpen(true);
              }}
              className="bg-theme-morado hover:bg-theme-morado/90 gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Nuevo Candidato
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
                    Foto
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Sediprano
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Cargo
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Área
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Votación
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {candidatos.data.map((candidato, index) => (
                  <motion.tr 
                    key={candidato.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50/50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {candidato.foto ? (
                        <img 
                          src={candidato.foto} 
                          alt={`Foto de ${candidato.sediprano.user.name}`} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserCircleIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {candidato.sediprano.user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {candidato.cargo.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {candidato.area ? (
                        <span className="inline-flex px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                          {candidato.area.abreviatura}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {candidato.votacion.nombre}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <Button
                        onClick={() => {
                          setEditingCandidato(candidato);
                          setIsModalOpen(true);
                        }}
                        variant="ghost"
                        className="p-1 mr-2 bg-transparent hover:bg-blue-50 group"
                      >
                        <PencilIcon className="w-[18px] h-[18px] text-black group-hover:text-blue-600" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(candidato)}
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
          {candidatos.last_page > 1 && (
            <div className="px-6 py-4 bg-white border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Mostrando {candidatos.from} a {candidatos.to} de {candidatos.total} candidatos
                </p>
                <div className="flex gap-2">
                  {candidatos.links.map((link, i) => {
                    if (link.url === null) return null;

                    return (
                      <Button
                        key={i}
                        onClick={() => handlePageChange(Number(link.label))}
                        className={`${
                          link.active
                            ? 'bg-theme-morado border-theme-morado text-white hover:bg-theme-morado/90'
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

      <CandidatoModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCandidato(null);
        }}
        candidato={editingCandidato}
        mode={editingCandidato ? 'edit' : 'create'}
        sedipranos={sedipranos}
        cargos={cargos}
        areas={areas}
        votaciones={votaciones}
      />

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar eliminación"
        message={`¿Estás seguro que deseas eliminar al candidato ${candidatoToDelete?.sediprano?.user?.name}? Esta acción no se puede deshacer.`}
      />
    </AuthenticatedLayout>
  );
}
