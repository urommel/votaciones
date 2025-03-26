import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';

interface AreaModalProps {
    isOpen: boolean;
    onClose: () => void;
    area?: Area;
    mode: 'create' | 'edit';
}

export function AreaModal({ isOpen, onClose, area, mode }: AreaModalProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre: area?.nombre || '',
        abreviatura: area?.abreviatura || '',
    });

    useEffect(() => {
        if (isOpen) {
            setData({
                nombre: area?.nombre || '',
                abreviatura: area?.abreviatura || '',
            });
        }
    }, [isOpen, area]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (mode === 'create') {
            post(route('areas.store'), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            put(route('areas.update', area?.id), {
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
                                    {mode === 'create' ? 'Nueva Área' : 'Editar Área'}
                                </Dialog.Title>

                                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Nombre
                                        </label>
                                        <Input
                                            value={data.nombre}
                                            onChange={e => setData('nombre', e.target.value)}
                                            placeholder="Nombre del área"
                                        />
                                        {errors.nombre && (
                                            <p className="text-sm text-red-600">{errors.nombre}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Abreviatura
                                        </label>
                                        <Input
                                            value={data.abreviatura}
                                            onChange={e => setData('abreviatura', e.target.value)}
                                            placeholder="Ej: MKT"
                                        />
                                        {errors.abreviatura && (
                                            <p className="text-sm text-red-600">{errors.abreviatura}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-3 mt-6">
                                        <Button
                                            type="button"
                                            onClick={onClose}
                                            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button type="submit" disabled={processing}>
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
