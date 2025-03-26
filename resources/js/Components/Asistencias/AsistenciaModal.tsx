import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Select } from '@/Components/ui/select';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { format } from 'date-fns';

interface User {
  id: number;
  name: string;
}

interface Sediprano {
  id: number;
  user: User;
}

interface Evento {
  id: number;
  nombre: string;
}

interface Asistencia {
  id: number;
  sediprano_id: number;
  evento_id: number;
  hora_registro: string;
  estado: string;
  observacion: string | null;
}

interface AsistenciaModalProps {
  isOpen: boolean;
  onClose: () => void;
  asistencia: Asistencia | null;
  mode: 'create' | 'edit';
  sedipranos: Sediprano[];
  eventos: Evento[];
}

export function AsistenciaModal({ 
  isOpen, 
  onClose, 
  asistencia, 
  mode,
  sedipranos,
  eventos
}: AsistenciaModalProps) {
  const { data, setData, post, put, processing, errors, reset } = useForm({
    sediprano_id: '',
    evento_id: '',
    hora_registro: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
    estado: 'presente',
    observacion: ''
  });

  useEffect(() => {
    if (isOpen && mode === 'edit' && asistencia) {
      // Convertir la fecha a formato ISO para el input datetime-local
      const fechaHora = format(new Date(asistencia.hora_registro), "yyyy-MM-dd'T'HH:mm");
      
      setData({
        sediprano_id: asistencia.sediprano_id.toString(),
        evento_id: asistencia.evento_id.toString(),
        hora_registro: fechaHora,
        estado: asistencia.estado,
        observacion: asistencia.observacion || ''
      });
    } else if (isOpen && mode === 'create') {
      reset('sediprano_id', 'evento_id', 'observacion');
      setData(prev => ({
        ...prev,
        hora_registro: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        estado: 'presente'
      }));
    }
  }, [isOpen, asistencia, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'create') {
      post(route('asistencias.store'), {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    } else {
      put(route('asistencias.update', asistencia?.id), {
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
            {mode === 'create' ? 'Registrar Asistencia' : 'Editar Asistencia'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="sediprano_id">Sediprano <span className="text-red-500">*</span></Label>
            <Select
              id="sediprano_id"
              value={data.sediprano_id}
              onChange={(e) => setData('sediprano_id', e.target.value)}
              disabled={mode === 'edit'}
            >
              <option value="">Selecciona un sediprano</option>
              {sedipranos.map((sediprano) => (
                <option key={sediprano.id} value={sediprano.id}>
                  {sediprano.user.name}
                </option>
              ))}
            </Select>
            {errors.sediprano_id && (
              <p className="text-sm text-red-500">{errors.sediprano_id}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="evento_id">Evento <span className="text-red-500">*</span></Label>
            <Select
              id="evento_id"
              value={data.evento_id}
              onChange={(e) => setData('evento_id', e.target.value)}
              disabled={mode === 'edit'}
            >
              <option value="">Selecciona un evento</option>
              {eventos.map((evento) => (
                <option key={evento.id} value={evento.id}>
                  {evento.nombre}
                </option>
              ))}
            </Select>
            {errors.evento_id && (
              <p className="text-sm text-red-500">{errors.evento_id}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hora_registro">Fecha y Hora <span className="text-red-500">*</span></Label>
              <Input
                id="hora_registro"
                type="datetime-local"
                value={data.hora_registro}
                onChange={(e) => setData('hora_registro', e.target.value)}
              />
              {errors.hora_registro && (
                <p className="text-sm text-red-500">{errors.hora_registro}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado <span className="text-red-500">*</span></Label>
              <Select
                id="estado"
                value={data.estado}
                onChange={(e) => setData('estado', e.target.value)}
              >
                <option value="presente">Presente</option>
                <option value="tardanza">Tardanza</option>
                <option value="falta">Falta</option>
              </Select>
              {errors.estado && (
                <p className="text-sm text-red-500">{errors.estado}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacion">Observación</Label>
            <Textarea
              id="observacion"
              value={data.observacion}
              onChange={(e) => setData('observacion', e.target.value)}
              rows={3}
              placeholder="Ej: Justificación o comentarios..."
            />
            {errors.observacion && (
              <p className="text-sm text-red-500">{errors.observacion}</p>
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
              className="!bg-theme-amarillo hover:!bg-theme-amarillo/90" // Usamos !important para forzar el estilo
            >
              {mode === 'create' ? 'Registrar' : 'Actualizar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
