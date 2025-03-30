import { useState, useCallback } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { UserPlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { motion } from 'framer-motion';
import { UserModal } from '@/Components/Users/UserModal';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import debounce from 'lodash/debounce';
import { ConfirmDialog } from '@/Components/ui/ConfirmDialog';

interface User {
    id: number;
    name: string;
    email: string;
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
    users: PaginatedData<User>;
    filters: {
        search: string;
    };
}

export default function Users({ users, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    
    const { delete: destroy } = useForm({});

    const debouncedSearch = useCallback(
        debounce((query: string) => {
            router.get(
                route('users.index'),
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
            route('users.index', { page }),
            { search: searchTerm },
            { preserveState: true }
        );
    };

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (userToDelete) {
            destroy(route('users.destroy', userToDelete.id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Usuarios" />
            
            <div className="p-8">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between gap-4"
                >
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Usuarios</h1>
                        <p className="mt-1 text-gray-500">Gestiona los usuarios del sistema</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Input
                                type="search"
                                placeholder="Buscar usuarios..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-[300px] pl-10"
                            />
                            <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                        </div>
                        <Button 
                            onClick={() => {
                                setEditingUser(null);
                                setIsModalOpen(true);
                            }}
                            className="bg-theme-morado hover:bg-theme-morado/90 gap-2"
                        >
                            <UserPlusIcon className="w-5 h-5" />
                            Nuevo Usuario
                        </Button>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 bg-white rounded-xl shadow-soft"
                >
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Nombre
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Fecha Registro
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.data.map((user, index) => (
                                    <motion.tr 
                                        key={user.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gray-50/50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-azul-oscuro">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {format(new Date(user.created_at), 'dd MMM yyyy', { locale: es })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Button
                                                onClick={() => {
                                                    setEditingUser(user);
                                                    setIsModalOpen(true);
                                                }}
                                                variant="ghost"
                                                className="p-1 mr-2 bg-transparent hover:bg-blue-50 group"
                                            >
                                                <PencilIcon className="w-[18px] h-[18px] text-black group-hover:text-blue-600" />
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteClick(user)}
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
                    {users.last_page > 1 && (
                        <div className="px-6 py-4 bg-white border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-700">
                                    Mostrando {users.from} a {users.to} de {users.total} usuarios
                                </p>
                                <div className="flex gap-2">
                                    {users.links.map((link, i) => {
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

            <UserModal 
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingUser(null);
                }}
                user={editingUser || undefined}
                mode={editingUser ? 'edit' : 'create'}
            />

            <ConfirmDialog
                isOpen={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmar eliminación"
                message={`¿Estás seguro que deseas eliminar al usuario ${userToDelete?.name}? Esta acción no se puede deshacer.`}
            />
        </AuthenticatedLayout>
    );
}
