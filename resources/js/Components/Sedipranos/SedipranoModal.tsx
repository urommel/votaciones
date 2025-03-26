import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select } from '@/Components/ui/select';
import { format } from 'date-fns';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Carrera {
  id: number;
  nombre: string;
}

interface Area {
  id: number;
  nombre: string;
  abreviatura: string;
}

interface Cargo {
  id: number;
  nombre: string;
}

interface Sediprano {
  id: number;
  codigo: number;
  dni: string;
  primer_apellido: string;
  segundo_apellido: string;
  carrera_id: number;
  genero: string;
  celular: string;
  fecha_nacimiento: string;
  user_id: number;
  cargo_id: number;
  area_id: number;
  created_at: string;
  user: User;
  carrera: Carrera | null;
  cargo: Cargo;
  area: Area | null;
}

interface SedipranoModalProps {
  isOpen: boolean;
  onClose: () => void;
  sediprano: Sediprano | null;
  mode: 'create' | 'edit';
  cargos: Cargo[];
  areas: Area[];
  carreras: Carrera[];
  generos: string[];
}

export function SedipranoModal({ 
  isOpen, 
  onClose, 
  sediprano, 
  mode,
  cargos,
  areas,
  carreras,
  generos
}: SedipranoModalProps) {
  const { data, setData, post, put, processing, errors, reset } = useForm({
    codigo: '',
    dni: '',
    primer_apellido: '',
    segundo_apellido: '',
    carrera_id: '',
    genero: '',
    celular: '',
    fecha_nacimiento: '',
    user_id: '',
    cargo_id: '',
    area_id: ''
  });

  // Estado para buscar usuarios
  const [users, setUsers] = useState<User[]>([]);
  const [searchingUser, setSearchingUser] = useState(false);
  const [userQuery, setUserQuery] = useState('');

  // Efecto para buscar usuarios
  useEffect(() => {
    if (userQuery.length >= 3) {
      setSearchingUser(true);
      fetch(route('api.users.search', { query: userQuery }))
        .then(res => res.json())
        .then(data => {
          setUsers(data);
          setSearchingUser(false);
        });
    } else {
      setUsers([]);
    }
  }, [userQuery]);

  useEffect(() => {
    if (isOpen && mode === 'edit' && sediprano) {
      setData({
        codigo: sediprano.codigo.toString(),
        dni: sediprano.dni || '',
        primer_apellido: sediprano.primer_apellido,
        segundo_apellido: sediprano.segundo_apellido,
        carrera_id: sediprano.carrera_id ? sediprano.carrera_id.toString() : '',
        genero: sediprano.genero,
        celular: sediprano.celular || '',
        fecha_nacimiento: sediprano.fecha_nacimiento ? format(new Date(sediprano.fecha_nacimiento), 'yyyy-MM-dd') : '',
        user_id: sediprano.user_id.toString(),
        cargo_id: sediprano.cargo_id.toString(),
        area_id: sediprano.area_id ? sediprano.area_id.toString() : ''
      });
      
      // Si estamos editando, mostrar el usuario actual
      if (sediprano.user) {
        setUsers([sediprano.user]);
      }
    } else if (isOpen && mode === 'create') {
      reset();
    }
  }, [isOpen, sediprano, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'create') {
      post(route('sedipranos.store'), {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    } else {
      put(route('sedipranos.update', sediprano?.id), {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Nuevo Sediprano' : 'Editar Sediprano'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código <span className="text-red-500">*</span></Label>
              <Input
                id="codigo"
                type="number"
                value={data.codigo}
                onChange={(e) => setData('codigo', e.target.value)}
                placeholder="Ej: 20191234"
              />
              {errors.codigo && (
                <p className="text-sm text-red-500">{errors.codigo}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dni">DNI</Label>
              <Input
                id="dni"
                value={data.dni}
                onChange={(e) => setData('dni', e.target.value)}
                placeholder="Ej: 12345678"
                maxLength={8}
              />
              {errors.dni && (
                <p className="text-sm text-red-500">{errors.dni}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primer_apellido">Primer Apellido <span className="text-red-500">*</span></Label>
              <Input
                id="primer_apellido"
                value={data.primer_apellido}
                onChange={(e) => setData('primer_apellido', e.target.value)}
                placeholder="Ej: Pérez"
              />
              {errors.primer_apellido && (
                <p className="text-sm text-red-500">{errors.primer_apellido}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="segundo_apellido">Segundo Apellido <span className="text-red-500">*</span></Label>
              <Input
                id="segundo_apellido"
                value={data.segundo_apellido}
                onChange={(e) => setData('segundo_apellido', e.target.value)}
                placeholder="Ej: Gómez"
              />
              {errors.segundo_apellido && (
                <p className="text-sm text-red-500">{errors.segundo_apellido}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="genero">Género <span className="text-red-500">*</span></Label>
              <Select
                id="genero"
                value={data.genero}
                onChange={(e) => setData('genero', e.target.value)}
              >
                <option value="">Selecciona un género</option>
                {generos.map((genero) => (
                  <option key={genero} value={genero}>
                    {genero.charAt(0).toUpperCase() + genero.slice(1)}
                  </option>
                ))}
              </Select>
              {errors.genero && (
                <p className="text-sm text-red-500">{errors.genero}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="celular">Celular</Label>
              <Input
                id="celular"
                type="tel"
                value={data.celular}
                onChange={(e) => setData('celular', e.target.value)}
                placeholder="Ej: 987654321"
                maxLength={9}
              />
              {errors.celular && (
                <p className="text-sm text-red-500">{errors.celular}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
              <Input
                id="fecha_nacimiento"
                type="date"
                value={data.fecha_nacimiento}
                onChange={(e) => setData('fecha_nacimiento', e.target.value)}
              />
              {errors.fecha_nacimiento && (
                <p className="text-sm text-red-500">{errors.fecha_nacimiento}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="carrera_id">Carrera</Label>
              <Select
                id="carrera_id"
                value={data.carrera_id}
                onChange={(e) => setData('carrera_id', e.target.value)}
              >
                <option value="">Selecciona una carrera</option>
                {carreras.map((carrera) => (
                  <option key={carrera.id} value={carrera.id}>
                    {carrera.nombre}
                  </option>
                ))}
              </Select>
              {errors.carrera_id && (
                <p className="text-sm text-red-500">{errors.carrera_id}</p>
              )}
            </div>
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
            <Label htmlFor="user_id">Usuario <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar usuario por nombre o email..."
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="mb-2"
              />
              {searchingUser && <p className="text-sm text-gray-500">Buscando usuarios...</p>}
              {users.length > 0 && (
                <div className="mt-2 overflow-y-auto border rounded-md max-h-40">
                  {users.map(user => (
                    <div 
                      key={user.id} 
                      className={`p-2 hover:bg-gray-100 cursor-pointer ${Number(data.user_id) === user.id ? 'bg-blue-50' : ''}`}
                      onClick={() => {
                        setData('user_id', user.id.toString());
                        setUserQuery(user.name);
                      }}
                    >
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  ))}
                </div>
              )}
              <input 
                type="hidden" 
                name="user_id" 
                value={data.user_id} 
              />
            </div>
            {errors.user_id && (
              <p className="text-sm text-red-500">{errors.user_id}</p>
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
