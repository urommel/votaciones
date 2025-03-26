import axios from 'axios';

export type EstadoVotacion = 'activa' | 'pendiente' | 'finalizada' | 'error';

interface EstadoVotacionResponse {
  estado: EstadoVotacion;
  mensaje: string;
}

interface ValidacionResponse {
  status: 'success' | 'error';
  message?: string;
  data?: {
    sediprano: any;
    votacion: any;
    candidatos: any[];
  };
}

interface RegistroVotoResponse {
  status: 'success' | 'error';
  message: string;
}

export const obtenerEstadoVotacion = async (): Promise<EstadoVotacionResponse> => {
  try {
    const response = await axios.get('/votacion-publica/estado');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estado de votación:', error);
    return {
      estado: 'error',
      mensaje: 'Error al conectar con el servidor'
    };
  }
};

export const validarAccesoVotacion = async (
  credentials: { codigo: string; dni: string }
): Promise<ValidacionResponse> => {
  try {
    const response = await axios.post('/votacion-publica/validar', credentials);
    return response.data;
  } catch (error: any) {
    console.error('Error al validar acceso:', error);
    return {
      status: 'error',
      message: error.response?.data?.message || 'Error al validar tus credenciales'
    };
  }
};

export const registrarVoto = async (
  votoData: {
    sediprano_id: number;
    votacion_id: number;
    candidato_id?: number | null;
    es_blanco: boolean;
  }
): Promise<RegistroVotoResponse> => {
  try {
    const response = await axios.post('/votacion-publica/registrar-voto', votoData);
    return response.data;
  } catch (error: any) {
    console.error('Error al registrar voto:', error);
    return {
      status: 'error',
      message: error.response?.data?.message || 'Error al registrar tu voto'
    };
  }
};
