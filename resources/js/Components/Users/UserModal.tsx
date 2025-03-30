interface User {
    id: number;
    name: string;
    email: string;
    // Añade otras propiedades necesarias
}

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user?: User;
    mode: 'create' | 'edit';
}

export function UserModal({ isOpen, onClose, user, mode }: UserModalProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: ''
    });

    useEffect(() => {
        if (isOpen) {
            setData({
                name: user?.name || '',
                email: user?.email || '',
                password: '',
                password_confirmation: ''
            });
        }
    }, [isOpen, user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (mode === 'create') {
            post(route('users.store'), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            put(route('users.update', user?.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all">
                                <Dialog.Title className="text-xl font-semibold text-gray-900">
                                    {mode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'}
                                </Dialog.Title>

                                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Nombre
                                        </label>
                                        <Input
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            placeholder="Nombre completo"
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <Input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            placeholder="correo@ejemplo.com"
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Contraseña
                                        </label>
                                        <Input
                                            type="password"
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            placeholder={mode === 'edit' ? 'Dejar en blanco para mantener' : '********'}
                                        />
                                        {errors.password && (
                                            <p className="text-sm text-red-600">{errors.password}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Confirmar Contraseña
                                        </label>
                                        <Input
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={e => setData('password_confirmation', e.target.value)}
                                            placeholder="********"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 mt-6">
                                        <Button
                                            type="button"
                                            onClick={onClose}
                                            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button 
                                            type="submit" 
                                            disabled={processing}
                                            className="bg-theme-morado hover:bg-theme-morado/90"
                                        >
                                            {processing ? 'Guardando...' : mode === 'create' ? 'Crear' : 'Actualizar'}
                                        </Button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
