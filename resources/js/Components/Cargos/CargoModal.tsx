import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';

interface Cargo {
    id: number;
    nombre: string;
    descripcion: string | null;
}

interface CargoModalProps {
    isOpen: boolean;
    onClose: () => void;
    cargo: Cargo | null;
    mode: 'create' | 'edit';
}

export function CargoModal({ isOpen, onClose, cargo, mode }: CargoModalProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre: '',
        descripcion: '',
    });

    useEffect(() => {
        if (isOpen && mode === 'edit' && cargo) {
            setData({
                nombre: cargo.nombre,
                descripcion: cargo.descripcion || '',
            });
        } else if (isOpen && mode === 'create') {
            reset('nombre', 'descripcion');
        }
    }, [isOpen, cargo, mode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (mode === 'create') {
            post(route('cargos.store'), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            put(route('cargos.update', cargo?.id), {
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
                        {mode === 'create' ? 'Nuevo Cargo' : 'Editar Cargo'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre <span className="text-red-500">*</span></Label>
                        <Input
                            id="nombre"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            placeholder="Ej: Presidente, Tesorero, etc."
                        />
                        {errors.nombre && (
                            <p className="text-sm text-red-500">{errors.nombre}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="descripcion">Descripción</Label>
                        <Textarea
                            id="descripcion"
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            rows={3}
                            placeholder="Descripción del cargo y sus responsabilidades..."
                        />
                        {errors.descripcion && (
                            <p className="text-sm text-red-500">{errors.descripcion}</p>
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
