import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { 
  obtenerEstadoVotacion, 
  validarAccesoVotacion,
} from '@/utils/votacion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";

// Iconos
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-yellow-500">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const XCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-red-500">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-green-500">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const AlertTriangleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-destructive">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const LoaderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 animate-spin text-primary">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
  </svg>
);

const VoteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
    <path d="M20 11a8.1 8.1 0 0 0-15.5-2m-.5 5v5h5"></path>
    <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5-5V5h-5"></path>
  </svg>
);

export default function AccesoPublico() {
  const [formData, setFormData] = useState({ codigo: '', dni: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isValidando, setIsValidando] = useState(false);
  const [votacionStatus, setVotacionStatus] = useState<{
    estado: 'activa' | 'pendiente' | 'finalizada' | 'votado' | 'error';
    mensaje: string;
  } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const checkVotacionStatus = async () => {
      try {
        setIsLoading(true);
        const estado = await obtenerEstadoVotacion();
        console.log('Estado actual obtenido:', estado);

        if (estado.estado === 'activa') {
          setShowForm(true);
          setVotacionStatus(null);
        } else {
          setShowForm(false);
          setVotacionStatus({
            estado: estado.estado,
            mensaje: estado.mensaje
          });
        }
      } catch (error) {
        console.error('Error al verificar estado:', error);
        setShowForm(false);
        setVotacionStatus({
          estado: 'error',
          mensaje: 'Error al verificar el estado de la votación'
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkVotacionStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidando(true);

    try {
      const response = await validarAccesoVotacion(formData);
      console.log('Respuesta recibida:', response);
      
      // Verificar primero si tenemos la estructura correcta
      if (response.status === 'error') {
        setErrorMessage(response.message || 'Error al validar el acceso');
        setShowErrorDialog(true);
        return;
      }
      
      if (!response.data) {
        throw new Error('Respuesta inválida del servidor');
      }
      
      // Formatear los datos para la sesión
      const votacionData = {
        votante: {
          id: response.data.sediprano.id,
          codigo: response.data.sediprano.codigo,
          nombre: `${response.data.sediprano.primer_apellido} ${response.data.sediprano.segundo_apellido}, ${response.data.sediprano.user.name}`,
          area: response.data.sediprano.area
        },
        votacion: {
          id: response.data.votacion.id,
          nombre: response.data.votacion.nombre,
          descripcion: response.data.votacion.descripcion,
          fecha_inicio: response.data.votacion.fecha_inicio,
          fecha_fin: response.data.votacion.fecha_fin,
          candidatos: response.data.candidatos
        },
        candidatos: response.data.candidatos
      };

      // Guardar en sessionStorage y redirigir
      sessionStorage.setItem('votacionData', JSON.stringify(votacionData));
      router.visit('/votacion-publica/emitir-voto');
    } catch (error: any) {
      console.error('Error en validación de acceso:', error);
      setErrorMessage(error.message || 'Error al validar el acceso. Intente nuevamente.');
      setShowErrorDialog(true);
    } finally {
      setIsValidando(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <LoaderIcon />
          <p className="text-lg text-gray-500">
            Verificando estado de la votación...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head title="Acceso a Votación" />
      
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center justify-center w-full max-w-md p-4 space-y-8">
          {/* Logo siempre visible */}
          <div className="flex flex-col items-center space-y-2">
            <img
              src="/img/logo-sedipro.png"
              alt="SEDIPRO"
              className="w-[180px] h-auto"
            />
            <h1 className="text-2xl font-bold tracking-tight text-center text-theme-azul">
              Sistema de Votación
            </h1>
          </div>

          {votacionStatus ? (
            <div className={`
              w-full p-6 rounded-lg shadow-sm border
              ${votacionStatus.estado === 'pendiente' ? 'border-yellow-200 bg-yellow-50' : ''}
              ${votacionStatus.estado === 'finalizada' ? 'border-red-200 bg-red-50' : ''}
              ${votacionStatus.estado === 'votado' ? 'border-green-200 bg-green-50' : ''}
              ${votacionStatus.estado === 'error' ? 'border-yellow-200 bg-yellow-50' : ''}
            `}>
              <div className="flex flex-col items-center gap-4 text-center">
                {votacionStatus.estado === 'pendiente' && <ClockIcon />}
                {votacionStatus.estado === 'finalizada' && <XCircleIcon />}
                {votacionStatus.estado === 'votado' && <CheckCircleIcon />}
                {votacionStatus.estado === 'error' && <AlertTriangleIcon />}
                
                <div className={`
                  ${votacionStatus.estado === 'pendiente' ? 'text-yellow-800' : ''}
                  ${votacionStatus.estado === 'finalizada' ? 'text-red-800' : ''}
                  ${votacionStatus.estado === 'votado' ? 'text-green-800' : ''}
                  ${votacionStatus.estado === 'error' ? 'text-yellow-800' : ''}
                `}>
                  <h3 className="mb-2 text-xl font-semibold">
                    {votacionStatus.estado === 'pendiente' && 'Votación Pendiente'}
                    {votacionStatus.estado === 'finalizada' && 'Votación Finalizada'}
                    {votacionStatus.estado === 'votado' && 'Voto Registrado'}
                    {votacionStatus.estado === 'error' && 'Error'}
                  </h3>
                  <p className="text-sm">{votacionStatus.mensaje}</p>
                </div>
              </div>
            </div>
          ) : showForm ? (
            <div className="w-full p-6 bg-white border rounded-lg shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código SEDIPRO</Label>
                  <Input
                    id="codigo"
                    placeholder="Ingresa tu código"
                    value={formData.codigo}
                    onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dni">DNI</Label>
                  <Input
                    id="dni"
                    placeholder="Ingresa tu DNI"
                    value={formData.dni}
                    onChange={(e) => setFormData(prev => ({ ...prev, dni: e.target.value }))}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-theme-azul hover:bg-theme-azul/90"
                  disabled={isValidando}
                >
                  {isValidando ? (
                    <>
                      <span className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Validando...
                    </>
                  ) : (
                    <>
                      <VoteIcon />
                      Acceder a Votación
                    </>
                  )}
                </Button>
              </form>
            </div>
          ) : null}

          <p className="text-sm text-center text-gray-500">
            Si tienes problemas para acceder, contacta al área de TI
          </p>
        </div>
      </div>

      <Dialog 
        open={showErrorDialog} 
        onOpenChange={setShowErrorDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-4">
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangleIcon />
              <span>Acceso no válido</span>
            </DialogTitle>
          </DialogHeader>
          
          {/* Contenido del error */}
          <div className="py-4">
            <span className="text-base text-gray-500">
              {errorMessage}
            </span>
          </div>

          {/* Footer con botón */}
          <div className="flex justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowErrorDialog(false)}
            >
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
