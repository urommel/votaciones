import { useEffect, useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Select } from '@/Components/ui/select';
import { UserCircleIcon } from '@heroicons/react/24/outline';

interface User {
  id: number;
  name: string;
}

interface Sediprano {
  id: number;
  codigo: number;
  primer_apellido: string;
  segundo_apellido: string;
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

interface Votacion {
  id: number;
  nombre: string;
}

interface Candidato {
  id: number;
  sediprano_id: number;
  cargo_id: number;
  area_id: number | null;
  votacion_id: number;
  foto: string | null;
  sediprano: Sediprano;
  cargo: Cargo;
  area: Area | null;
  votacion: Votacion;
}

interface CandidatoModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidato: Candidato | null;
  mode: 'create' | 'edit';
  sedipranos: Sediprano[];
  cargos: Cargo[];
  areas: Area[];
  votaciones: Votacion[];
}

export function CandidatoModal({ 
  isOpen, 
  onClose, 
  candidato, 
  mode,
  sedipranos,
  cargos,
  areas,
  votaciones
}: CandidatoModalProps) {
  const { data, setData, post, put, processing, errors, reset, setError, clearErrors } = useForm({
    sediprano_id: '',
    cargo_id: '',
    area_id: '',
    votacion_id: '',
    foto: null as File | null
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && mode === 'edit' && candidato) {
      setData({
        sediprano_id: candidato.sediprano_id.toString(),
        cargo_id: candidato.cargo_id.toString(),
        area_id: candidato.area_id ? candidato.area_id.toString() : '',
        votacion_id: candidato.votacion_id.toString(),
        foto: null
      });
      
      // Mostrar la foto actual si existe
      if (candidato.foto) {
        setPreview(candidato.foto);
      } else {
        setPreview(null);
      }
    } else if (isOpen && mode === 'create') {
      reset();
      setPreview(null);
    }
  }, [isOpen, candidato, mode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Validar tamaño (2MB) y tipo
      if (file.size > 2 * 1024 * 1024) {
        setError('foto', 'La imagen no debe ser mayor a 2MB');
        return;
      }
      
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        setError('foto', 'El archivo debe ser una imagen (jpeg, png, gif)');
        return;
      }
      
      clearErrors('foto');
      setData('foto', file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setData('foto', null);
      setPreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'create') {
      post(route('candidatos.store'), {
        onSuccess: () => {
          reset();
          setPreview(null);
          onClose();
        },
        forceFormData: true
      });
    } else {
      put(route('candidatos.update', candidato?.id), {
        onSuccess: () => {
          onClose();
        },
        forceFormData: true
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Nuevo Candidato' : 'Editar Candidato'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="sediprano_id">Sediprano <span className="text-red-500">*</span></Label>
            <Select
              id="sediprano_id"
              value={data.sediprano_id}
              onChange={(e) => setData('sediprano_id', e.target.value)}
            >
              <option value="">Selecciona un sediprano</option>
              {sedipranos.map((sediprano) => (
                <option key={sediprano.id} value={sediprano.id}>
                  {sediprano.user.name} ({sediprano.codigo})
                </option>
              ))}
            </Select>
            {errors.sediprano_id && (
              <p className="text-sm text-red-500">{errors.sediprano_id}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cargo_id">Cargo <span className="text-red-500">*</span></Label>
              <Select
                id="cargo_id"
                value={data.cargo_id}
                onChange={(e) => setData('cargo_id', e.target.value)}
              >
                <option value="">Selecciona un cargo</option>
                {cargos.map((cargo) => (
                  <option key={cargo.id} value={cargo.id}>
                    {cargo.nombre}
                  </option>
                ))}
              </Select>
              {errors.cargo_id && (
                <p className="text-sm text-red-500">{errors.cargo_id}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="area_id">Área</Label>
              <Select
                id="area_id"
                value={data.area_id}
                onChange={(e) => setData('area_id', e.target.value)}
              >
                <option value="">Selecciona un área</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.nombre}
                  </option>
                ))}
              </Select>
              {errors.area_id && (
                <p className="text-sm text-red-500">{errors.area_id}</p>
              )}
            </div>
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
                  {votacion.nombre}
                </option>
              ))}
            </Select>
            {errors.votacion_id && (
              <p className="text-sm text-red-500">{errors.votacion_id}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="foto">Foto</Label>
            <div className="flex items-center space-x-4">
              {preview && (
                <div className="flex-shrink-0">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-md"
                  />
                </div>
              )}
              <div className="flex-grow">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="foto"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {preview ? 'Cambiar foto' : 'Subir foto'}
                </Button>
                {preview && (
                  <Button
                    type="button"
                    variant="outline"
                    className="ml-2 text-red-500"
                    onClick={() => {
                      setData('foto', null);
                      setPreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    Eliminar
                  </Button>
                )}
              </div>
            </div>
            {errors.foto && (
              <p className="text-sm text-red-500">{errors.foto}</p>
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
