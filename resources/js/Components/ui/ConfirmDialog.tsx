import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Button } from './button';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Eliminar',
    cancelText = 'Cancelar'
}: ConfirmDialogProps) {
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
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                        <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div>
                                        <Dialog.Title className="text-lg font-semibold text-gray-900">
                                            {title}
                                        </Dialog.Title>
                                        <Dialog.Description className="mt-2 text-sm text-gray-500">
                                            {message}
                                        </Dialog.Description>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        onClick={onClose}
                                        className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    >
                                        {cancelText}
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            onConfirm();
                                            onClose();
                                        }}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        {confirmText}
                                    </Button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
