import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';

interface Carrera {
    id: number;
    nombre: string;
    created_at: string;
}

interface CarreraModalProps {
    isOpen: boolean;
    onClose: () => void;
    carrera: Carrera | null;
    mode: 'create' | 'edit';
}

export function CarreraModal({ isOpen, onClose, carrera, mode }: CarreraModalProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre: '',
    });

    useEffect(() => {
        if (isOpen && mode === 'edit' && carrera) {
            setData({
                nombre: carrera.nombre,
            });
        } else if (isOpen && mode === 'create') {
            reset('nombre');
        }
    }, [isOpen, carrera, mode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (mode === 'create') {
            post(route('carreras.store'), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            put(route('carreras.update', carrera?.id), {
                onSuccess: () => {
                    onClose();
                },
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'create' ? 'Nueva Carrera' : 'Editar Carrera'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-4 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre <span className="text-red-500">*</span></Label>
                        <Input
                            id="nombre"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            placeholder="Ej: Ingeniería de Sistemas"
                        />
                        {errors.nombre && (
                            <p className="text-sm text-red-500">{errors.nombre}</p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {mode === 'create' ? 'Crear' : 'Actualizar'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
