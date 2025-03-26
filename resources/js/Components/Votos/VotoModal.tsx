import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Select } from '@/Components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group';

interface User {
  id: number;
  name: string;
}

interface Sediprano {
  id: number;
  user: User;
}

interface Cargo {
  id: number;
  nombre: string;
}

interface Area {
  id: number;
  nombre: string;
  abreviatura: string;
}

interface Candidato {
  id: number;
  sediprano: Sediprano;
  cargo: Cargo;
  area: Area | null;
  votacion_id: number;
}

interface Votacion {
  id: number;
  name: string;
}

interface VotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  sedipranos: Sediprano[];
  candidatos: Candidato[];
  votaciones: Votacion[];
}

export function VotoModal({ 
  isOpen, 
  onClose, 
  sedipranos,
  candidatos, 
  votaciones
}: VotoModalProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    sediprano_id: '',
    votacion_id: '',
    tipo_voto: 'candidato', // 'candidato' o 'blanco'
    candidato_id: '',
    es_blanco: false
  });

  const [filteredCandidatos, setFilteredCandidatos] = useState<Candidato[]>([]);

  // Cuando cambia la votación, filtrar candidatos y resetear selección
  useEffect(() => {
    if (data.votacion_id) {
      const candidatosFiltrados = candidatos.filter(
        candidato => candidato.votacion_id === Number(data.votacion_id)
      );
      setFilteredCandidatos(candidatosFiltrados);
      setData('candidato_id', '');
    } else {
      setFilteredCandidatos([]);
    }
  }, [data.votacion_id, candidatos]);

  // Cuando se abre el modal, resetear el formulario
  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen]);

  // Actualizar es_blanco según el tipo de voto seleccionado
  useEffect(() => {
    setData('es_blanco', data.tipo_voto === 'blanco');
    if (data.tipo_voto === 'blanco') {
      setData('candidato_id', '');
    }
  }, [data.tipo_voto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    post(route('votos.store'), {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Registrar Nuevo Voto
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="sediprano_id">Sediprano que vota <span className="text-red-500">*</span></Label>
            <Select
              id="sediprano_id"
              value={data.sediprano_id}
              onChange={(e) => setData('sediprano_id', e.target.value)}
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
            <Label htmlFor="votacion_id">Votación <span className="text-red-500">*</span></Label>
            <Select
              id="votacion_id"
              value={data.votacion_id}
              onChange={(e) => setData('votacion_id', e.target.value)}
            >
              <option value="">Selecciona una votación</option>
              {votaciones.map((votacion) => (
                <option key={votacion.id} value={votacion.id}>
                  {votacion.name}
                </option>
              ))}
            </Select>
            {errors.votacion_id && (
              <p className="text-sm text-red-500">{errors.votacion_id}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tipo de Voto <span className="text-red-500">*</span></Label>
            <RadioGroup 
              value={data.tipo_voto} 
              onValueChange={(value) => setData('tipo_voto', value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="candidato" value="candidato" />
                <Label htmlFor="candidato" className="cursor-pointer">Voto por candidato</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="blanco" value="blanco" />
                <Label htmlFor="blanco" className="cursor-pointer">Voto en blanco</Label>
              </div>
            </RadioGroup>
            {errors.tipo_voto && (
              <p className="text-sm text-red-500">{errors.tipo_voto}</p>
            )}
          </div>

          {data.tipo_voto === 'candidato' && data.votacion_id && (
            <div className="space-y-2">
              <Label htmlFor="candidato_id">Candidato <span className="text-red-500">*</span></Label>
              <Select
                id="candidato_id"
                value={data.candidato_id}
                onChange={(e) => setData('candidato_id', e.target.value)}
                disabled={filteredCandidatos.length === 0}
              >
                <option value="">Selecciona un candidato</option>
                {filteredCandidatos.map((candidato) => (
                  <option key={candidato.id} value={candidato.id}>
                    {candidato.sediprano.user.name} - {candidato.cargo.nombre}
                    {candidato.area ? ` (${candidato.area.abreviatura})` : ''}
                  </option>
                ))}
              </Select>
              {filteredCandidatos.length === 0 && data.votacion_id && (
                <p className="text-sm text-amber-500">No hay candidatos registrados para esta votación.</p>
              )}
              {errors.candidato_id && (
                <p className="text-sm text-red-500">{errors.candidato_id}</p>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={processing}
              className="bg-theme-cyan hover:bg-theme-cyan/90"
            >
              Registrar Voto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
