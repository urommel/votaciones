import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Select } from '@/Components/ui/select';
import { format } from 'date-fns';

interface Evento {
  id: number;
  nombre: string;
  descripcion: string | null;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
  ubicacion: string | null;
}

interface EventoModalProps {
  isOpen: boolean;
  onClose: () => void;
  evento: Evento | null;
  mode: 'create' | 'edit';
  estados: string[];
}

export function EventoModal({ isOpen, onClose, evento, mode, estados }: EventoModalProps) {
  const { data, setData, post, put, processing, errors, reset } = useForm({
    nombre: '',
    descripcion: '',
    fecha: format(new Date(), 'yyyy-MM-dd'),
    hora_inicio: '08:00',
    hora_fin: '18:00',
    estado: 'programado',
    ubicacion: ''
  });

  useEffect(() => {
    if (isOpen && mode === 'edit' && evento) {
      setData({
        nombre: evento.nombre,
        descripcion: evento.descripcion || '',
        fecha: evento.fecha,
        hora_inicio: evento.hora_inicio,
        hora_fin: evento.hora_fin,
        estado: evento.estado,
        ubicacion: evento.ubicacion || ''
      });
    } else if (isOpen && mode === 'create') {
      reset('nombre', 'descripcion', 'ubicacion');
      setData(prev => ({
        ...prev,
        fecha: format(new Date(), 'yyyy-MM-dd'),
        hora_inicio: '08:00',
        hora_fin: '18:00',
        estado: 'programado'
      }));
    }
  }, [isOpen, evento, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'create') {
      post(route('eventos.store'), {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    } else {
      put(route('eventos.update', evento?.id), {
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
            {mode === 'create' ? 'Nuevo Evento' : 'Editar Evento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre <span className="text-red-500">*</span></Label>
            <Input
              id="nombre"
              value={data.nombre}
              onChange={(e) => setData('nombre', e.target.value)}
              placeholder="Ej: Reunión de Coordinación"
            />
            {errors.nombre && (
              <p className="text-sm text-red-500">{errors.nombre}</p>
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
                    {estado === 'en_curso' ? 'En Curso' : estado.charAt(0).toUpperCase() + estado.slice(1)}
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
            <Label htmlFor="ubicacion">Ubicación</Label>
            <Input
              id="ubicacion"
              value={data.ubicacion}
              onChange={(e) => setData('ubicacion', e.target.value)}
              placeholder="Ej: Aula 301, Edificio Central"
            />
            {errors.ubicacion && (
              <p className="text-sm text-red-500">{errors.ubicacion}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={data.descripcion}
              onChange={(e) => setData('descripcion', e.target.value)}
              rows={3}
              placeholder="Descripción del evento..."
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
              variant="default"
              className="!bg-theme-verde hover:!bg-theme-verde/90" // Usamos !important para forzar el estilo
            >
              {mode === 'create' ? 'Crear' : 'Actualizar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
