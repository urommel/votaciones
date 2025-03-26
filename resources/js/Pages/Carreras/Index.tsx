import { useState, useCallback } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { motion } from 'framer-motion';
import { CarreraModal } from '@/Components/Carreras/CarreraModal';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import debounce from 'lodash/debounce';
import { ConfirmDialog } from '@/Components/ui/ConfirmDialog';

interface Carrera {
    id: number;
    nombre: string;
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
    carreras: PaginatedData<Carrera>;
    filters: {
        search: string;
    };
}

export default function Carreras({ carreras, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCarrera, setEditingCarrera] = useState<Carrera | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [carreraToDelete, setCarreraToDelete] = useState<Carrera | null>(null);
    
    const { delete: destroy } = useForm({});

    // Debounce la búsqueda
    const debouncedSearch = useCallback(
        debounce((query: string) => {
            router.get(
                route('carreras.index'),
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
            route('carreras.index', { page }),
            { 
                search: searchTerm,
            },
            { preserveState: true }
        );
    };

    const handleDeleteClick = (carrera: Carrera) => {
        setCarreraToDelete(carrera);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (carreraToDelete) {
            destroy(route('carreras.destroy', carreraToDelete.id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Carreras" />
            
            <div className="p-8">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between gap-4"
                >
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Carreras</h1>
                        <p className="mt-1 text-gray-500">Gestiona las carreras universitarias</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Input
                                type="search"
                                placeholder="Buscar carreras..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-[300px] pl-10"
                            />
                            <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                        </div>
                        <Button 
                            onClick={() => {
                                setEditingCarrera(null);
                                setIsModalOpen(true);
                            }}
                            className="gap-2"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Nueva Carrera
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
                                        Fecha Creación
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {carreras.data.map((carrera, index) => (
                                    <motion.tr 
                                        key={carrera.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gray-50/50"
                                    >
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                            {carrera.nombre}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                            {format(new Date(carrera.created_at), 'dd MMM yyyy', { locale: es })}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                            <Button
                                                onClick={() => {
                                                    setEditingCarrera(carrera);
                                                    setIsModalOpen(true);
                                                }}
                                                variant="ghost"
                                                className="p-1 mr-2 bg-transparent hover:bg-blue-50 group"
                                            >
                                                <PencilIcon className="w-[18px] h-[18px] text-black group-hover:text-blue-600" />
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteClick(carrera)}
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
                    {carreras.last_page > 1 && (
                        <div className="px-6 py-4 bg-white border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-700">
                                    Mostrando {carreras.from} a {carreras.to} de {carreras.total} carreras
                                </p>
                                <div className="flex gap-2">
                                    {carreras.links.map((link, i) => {
                                        if (link.url === null) return null;

                                        return (
                                            <Button
                                                key={i}
                                                onClick={() => handlePageChange(Number(link.label))}
                                                className={`${
                                                    link.active
                                                        ? 'bg-theme-azul border-theme-azul text-white hover:bg-theme-azul/90'
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

            <CarreraModal 
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingCarrera(null);
                }}
                carrera={editingCarrera}
                mode={editingCarrera ? 'edit' : 'create'}
            />

            <ConfirmDialog
                isOpen={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmar eliminación"
                message={`¿Estás seguro que deseas eliminar la carrera ${carreraToDelete?.nombre}? Esta acción no se puede deshacer.`}
            />
        </AuthenticatedLayout>
    );
}
