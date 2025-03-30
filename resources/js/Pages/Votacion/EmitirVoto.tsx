import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group';
import { Label } from '@/Components/ui/label';
import { registrarVoto } from '@/utils/votacion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";

// Componentes faltantes
const DialogDescription = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm text-gray-500">{children}</div>
);

const DialogFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-end gap-2 mt-4">{children}</div>
);

// Tipos de datos
interface Votante {
  id: number;
  codigo: string;
  nombre: string;
  area: {
    id: number;
    nombre: string;
    abreviatura: string;
  } | null;
}

interface Candidato {
  id: number;
  sediprano: {
    user: {
      name: string;
    };
    primer_apellido: string;
    segundo_apellido: string;
  };
  cargo: {
    nombre: string;
  };
  area: {
    abreviatura: string;
  } | null;
  foto: string | null;
}

interface Votacion {
  id: number;
  nombre: string;
  descripcion: string | null;
  fecha_inicio: string;
  fecha_fin: string;
}

interface VotacionData {
  votante: Votante;
  votacion: Votacion;
  candidatos: Candidato[];
}

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-green-500">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const AlertCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-red-500">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

export default function EmitirVoto() {
  const [votacionData, setVotacionData] = useState<VotacionData | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    // Recuperar datos del sessionStorage
    const storedData = sessionStorage.getItem('votacionData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setVotacionData(parsedData);
      } catch (error) {
        console.error('Error al parsear datos de votación:', error);
        window.location.href = '/votacion-publica';
      }
    } else {
      // Redirigir si no hay datos
      window.location.href = '/votacion-publica';
    }
  }, []);

  const handleVoteSubmit = async () => {
    if (!votacionData || !selectedOption) return;
    
    setIsSubmitting(true);
    setShowConfirmDialog(false);
    
    try {
      const esBlanco = selectedOption === 'blanco';
      const candidatoId = esBlanco ? null : parseInt(selectedOption);
      
      const result = await registrarVoto({
        sediprano_id: votacionData.votante.id,
        votacion_id: votacionData.votacion.id,
        candidato_id: candidatoId,
        es_blanco: esBlanco
      });
      
      setSubmitResult({
        success: result.status === 'success',
        message: result.message
      });
      
      setShowResultDialog(true);
      
      if (result.status === 'success') {
        // Limpiar sessionStorage después de un voto exitoso
        setTimeout(() => {
          sessionStorage.removeItem('votacionData');
          window.location.href = '/votacion-publica';
        }, 3000);
      }
    } catch (error: any) {
      setSubmitResult({
        success: false,
        message: error.message || 'Error al registrar tu voto. Inténtalo nuevamente.'
      });
      setShowResultDialog(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!votacionData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-500">Cargando datos de votación...</p>
        </div>
      </div>
    );
  }

  const candidatoSeleccionado = selectedOption !== 'blanco' && selectedOption 
    ? votacionData.candidatos.find(c => c.id.toString() === selectedOption) 
    : null;

  return (
    <>
      <Head title="Emitir Voto" />
      
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-theme-azul">Emitir Voto</h1>
              <p className="text-gray-500">
                {votacionData.votacion.nombre}
              </p>
            </div>
            <img src="/img/logo-sedipro.png" alt="SEDIPRO" className="h-10" />
          </div>
          
          {/* Información del votante */}
          <Card>
            <CardHeader>
              <CardTitle>Datos del Votante</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nombre:</p>
                  <p>{votacionData.votante.nombre}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Código:</p>
                  <p>{votacionData.votante.codigo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Área:</p>
                  <p>{votacionData.votante.area?.nombre || '—'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Candidatos */}
          <Card>
            <CardHeader>
              <CardTitle>Candidatos</CardTitle>
              <CardDescription>
                Selecciona un candidato o voto en blanco
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedOption}
                onValueChange={setSelectedOption}
                className="space-y-4"
              >
                {votacionData.candidatos.map((candidato) => (
                  <div 
                    key={candidato.id} 
                    className={`flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      selectedOption === candidato.id.toString() ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedOption(candidato.id.toString())}
                  >
                    <RadioGroupItem 
                      id={`candidato-${candidato.id}`} 
                      value={candidato.id.toString()} 
                    />
                    <div className="flex items-center flex-1 space-x-4">
                      <div className="flex-shrink-0">
                        {candidato.foto ? (
                          <img 
                            src={candidato.foto} 
                            alt={candidato.sediprano.user.name} 
                            className="object-cover w-16 h-16 rounded-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-16 h-16 text-gray-400 bg-gray-200 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={`candidato-${candidato.id}`} className="font-medium cursor-pointer">
                          {candidato.sediprano.primer_apellido} {candidato.sediprano.segundo_apellido}, {candidato.sediprano.user.name}
                        </Label>
                        <p className="text-sm text-gray-500">
                          {candidato.cargo.nombre} {candidato.area ? `- ${candidato.area.abreviatura}` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Voto en blanco */}
                <div 
                  className={`flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedOption === 'blanco' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedOption('blanco')}
                >
                  <RadioGroupItem id="voto-blanco" value="blanco" />
                  <Label htmlFor="voto-blanco" className="font-medium cursor-pointer">
                    Voto en blanco
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={() => setShowConfirmDialog(true)}
                className="bg-theme-azul hover:bg-theme-azul/90"
                disabled={!selectedOption || isSubmitting}
              >
                Emitir Voto
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Diálogo de confirmación */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Voto</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. ¿Estás seguro de emitir tu voto?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {selectedOption === 'blanco' ? (
              <p className="font-medium">Has seleccionado: Voto en blanco</p>
            ) : candidatoSeleccionado ? (
              <div className="space-y-2">
                <p className="font-medium">Has seleccionado al candidato:</p>
                <div className="flex items-center p-3 space-x-3 border rounded-lg">
                  {candidatoSeleccionado.foto ? (
                    <img 
                      src={candidatoSeleccionado.foto} 
                      alt={candidatoSeleccionado.sediprano.user.name} 
                      className="object-cover w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">
                      {candidatoSeleccionado.sediprano.primer_apellido} {candidatoSeleccionado.sediprano.segundo_apellido}, {candidatoSeleccionado.sediprano.user.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {candidatoSeleccionado.cargo.nombre} {candidatoSeleccionado.area ? `- ${candidatoSeleccionado.area.abreviatura}` : ''}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-red-600">No has seleccionado ninguna opción</p>
            )}
          </div>
          
          <DialogFooter>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancelar
              </Button>
              <Button 
                className="bg-theme-azul hover:bg-theme-azul/90"
                onClick={handleVoteSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Procesando...' : 'Confirmar Voto'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de resultado */}
      <Dialog 
        open={showResultDialog} 
        onOpenChange={setShowResultDialog}
      >
        <DialogContent>
          <div className="flex flex-col items-center py-6 space-y-4 text-center">
            {submitResult?.success ? (
              <>
                <CheckCircleIcon />
                <h3 className="text-xl font-semibold text-green-600">¡Voto Registrado!</h3>
              </>
            ) : (
              <>
                <AlertCircleIcon />
                <h3 className="text-xl font-semibold text-red-600">Error al Votar</h3>
              </>
            )}
            <p className="text-gray-600">
              {submitResult?.message}
            </p>
            
            <Button
              onClick={() => {
                setShowResultDialog(false);
                if (submitResult?.success) {
                  // Si fue exitoso, redirigir automáticamente
                  window.location.href = '/votacion-publica';
                }
              }}
              className={submitResult?.success ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"}
            >
              {submitResult?.success ? "Finalizar" : "Entendido"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
