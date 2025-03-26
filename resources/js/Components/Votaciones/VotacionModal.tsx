import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Select } from '@/Components/ui/select';
import { format } from 'date-fns';

interface Votacion {
  id: number;
  name: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  descripcion: string | null;
  estado: string;
}

interface VotacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  votacion: Votacion | null;
  mode: 'create' | 'edit';
  estados: string[];
}

export function VotacionModal({ isOpen, onClose, votacion, mode, estados }: VotacionModalProps) {
  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: '',
    fecha: format(new Date(), 'yyyy-MM-dd'),
    hora_inicio: '08:00',
    hora_fin: '18:00',
    descripcion: '',
    estado: 'pendiente'
  });

  useEffect(() => {
    if (isOpen && mode === 'edit' && votacion) {
      setData({
        name: votacion.name,
        fecha: votacion.fecha,
        hora_inicio: votacion.hora_inicio,
        hora_fin: votacion.hora_fin,
        descripcion: votacion.descripcion || '',
        estado: votacion.estado
      });
    } else if (isOpen && mode === 'create') {
      reset('name', 'descripcion');
      setData(prev => ({
        ...prev,
        fecha: format(new Date(), 'yyyy-MM-dd'),
        hora_inicio: '08:00',
        hora_fin: '18:00',
        estado: 'pendiente'
      }));
    }
  }, [isOpen, votacion, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'create') {
      post(route('votaciones.store'), {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    } else {
      put(route('votaciones.update', votacion?.id), {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Nueva Votación' : 'Editar Votación'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              placeholder="Ej: Elección de Junta Directiva 2024"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha <span className="text-red-500">*</span></Label>
              <Input
                id="fecha"
                type="date"
                value={data.fecha}
                onChange={(e) => setData('fecha', e.target.value)}
              />
              {errors.fecha && (
                <p className="text-sm text-red-500">{errors.fecha}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado <span className="text-red-500">*</span></Label>
              <Select
                id="estado"
                value={data.estado}
                onChange={(e) => setData('estado', e.target.value)}
              >
                {estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado.charAt(0).toUpperCase() + estado.slice(1)}
                  </option>
                ))}
              </Select>
              {errors.estado && (
                <p className="text-sm text-red-500">{errors.estado}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hora_inicio">Hora Inicio <span className="text-red-500">*</span></Label>
              <Input
                id="hora_inicio"
                type="time"
                value={data.hora_inicio}
                onChange={(e) => setData('hora_inicio', e.target.value)}
              />
              {errors.hora_inicio && (
                <p className="text-sm text-red-500">{errors.hora_inicio}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora_fin">Hora Fin <span className="text-red-500">*</span></Label>
              <Input
                id="hora_fin"
                type="time"
                value={data.hora_fin}
                onChange={(e) => setData('hora_fin', e.target.value)}
              />
              {errors.hora_fin && (
                <p className="text-sm text-red-500">{errors.hora_fin}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={data.descripcion}
              onChange={(e) => setData('descripcion', e.target.value)}
              rows={3}
              placeholder="Descripción de la votación..."
            />
            {errors.descripcion && (
              <p className="text-sm text-red-500">{errors.descripcion}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={processing}
              className="bg-theme-rosa hover:bg-theme-rosa/90"
            >
              {mode === 'create' ? 'Crear' : 'Actualizar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
