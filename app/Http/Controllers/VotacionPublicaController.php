<?php

namespace App\Http\Controllers;

use App\Models\Votacion;
use App\Models\Sediprano;
use App\Models\Candidato;
use App\Models\Voto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class VotacionPublicaController extends Controller
{
    /**
     * Muestra la página de acceso a votación pública
     */
    public function index()
    {
        // Obtener fecha y hora actual
        $ahora = Carbon::now();
        $fechaActual = $ahora->toDateString();
        $horaActual = $ahora->format('H:i:s');

        // Buscar la votación activa actual
        $votacionActiva = Votacion::where('estado', 'activa')
            ->where('fecha', '=', $fechaActual)
            ->where('hora_inicio', '<=', $horaActual)
            ->where('hora_fin', '>=', $horaActual)
            ->first();

        $estado = null;
        $mensaje = null;

        if (!$votacionActiva) {
            // Buscar si hay votación pendiente próxima
            $votacionPendiente = Votacion::where('estado', 'pendiente')
                ->where(function($query) use ($fechaActual, $horaActual) {
                    $query->where('fecha', '>', $fechaActual)
                        ->orWhere(function($q) use ($fechaActual, $horaActual) {
                            $q->where('fecha', '=', $fechaActual)
                            ->where('hora_inicio', '>', $horaActual);
                        });
                })
                ->orderBy('fecha', 'asc')
                ->orderBy('hora_inicio', 'asc')
                ->first();

            if ($votacionPendiente) {
                $fechaInicio = Carbon::parse($votacionPendiente->fecha . ' ' . $votacionPendiente->hora_inicio);
                $estado = 'pendiente';
                $mensaje = "La próxima votación comenzará el " . $fechaInicio->format('d/m/Y') . " a las " . $fechaInicio->format('H:i') . " horas.";
            } else {
                // Buscar la última votación finalizada
                $votacionFinalizada = Votacion::where('estado', 'finalizada')
                    ->orWhere(function($query) use ($fechaActual, $horaActual) {
                        $query->where('fecha', '<', $fechaActual)
                            ->orWhere(function($q) use ($fechaActual, $horaActual) {
                                $q->where('fecha', '=', $fechaActual)
                                ->where('hora_fin', '<', $horaActual);
                            });
                    })
                    ->orderBy('fecha', 'desc')
                    ->orderBy('hora_fin', 'desc')
                    ->first();

                if ($votacionFinalizada) {
                    $estado = 'finalizada';
                    $mensaje = "La votación ha finalizado. Gracias por tu participación.";
                } else {
                    $estado = 'error';
                    $mensaje = "No hay votaciones programadas actualmente.";
                }
            }
        } else {
            $estado = 'activa';
            $mensaje = "Votación activa. Puedes proceder a validar tu acceso.";
        }

        return Inertia::render('Votacion/AccesoPublico', [
            'estado' => $estado,
            'mensaje' => $mensaje,
            'votacionActiva' => $votacionActiva
        ]);
    }

    /**
     * Obtiene el estado actual de la votación
     */
    public function estadoVotacion()
    {
        // Obtener fecha y hora actual
        $ahora = Carbon::now();
        $fechaActual = $ahora->toDateString();
        $horaActual = $ahora->format('H:i:s');

        // Buscar la votación activa actual
        $votacionActiva = Votacion::where('estado', 'activa')
            ->where('fecha', '=', $fechaActual)
            ->where('hora_inicio', '<=', $horaActual)
            ->where('hora_fin', '>=', $horaActual)
            ->first();

        if (!$votacionActiva) {
            // Buscar si hay votación pendiente próxima
            $votacionPendiente = Votacion::where('estado', 'pendiente')
                ->where(function($query) use ($fechaActual, $horaActual) {
                    $query->where('fecha', '>', $fechaActual)
                        ->orWhere(function($q) use ($fechaActual, $horaActual) {
                            $q->where('fecha', '=', $fechaActual)
                            ->where('hora_inicio', '>', $horaActual);
                        });
                })
                ->orderBy('fecha', 'asc')
                ->orderBy('hora_inicio', 'asc')
                ->first();

            if ($votacionPendiente) {
                $fechaInicio = Carbon::parse($votacionPendiente->fecha . ' ' . $votacionPendiente->hora_inicio);
                $mensaje = "La próxima votación comenzará el " . $fechaInicio->format('d/m/Y') . " a las " . $fechaInicio->format('H:i') . " horas.";
                
                return response()->json([
                    'estado' => 'pendiente',
                    'mensaje' => $mensaje
                ]);
            }

            // Buscar la última votación finalizada
            $votacionFinalizada = Votacion::where('estado', 'finalizada')
                ->orWhere(function($query) use ($fechaActual, $horaActual) {
                    $query->where('fecha', '<', $fechaActual)
                        ->orWhere(function($q) use ($fechaActual, $horaActual) {
                            $q->where('fecha', '=', $fechaActual)
                            ->where('hora_fin', '<', $horaActual);
                        });
                })
                ->orderBy('fecha', 'desc')
                ->orderBy('hora_fin', 'desc')
                ->first();

            if ($votacionFinalizada) {
                return response()->json([
                    'estado' => 'finalizada',
                    'mensaje' => "La votación ha finalizado. Gracias por tu participación."
                ]);
            }

            return response()->json([
                'estado' => 'error',
                'mensaje' => "No hay votaciones programadas actualmente."
            ]);
        }

        return response()->json([
            'estado' => 'activa',
            'mensaje' => "Votación activa. Puedes proceder a validar tu acceso."
        ]);
    }

    /**
     * Valida el acceso de un sediprano a la votación
     */
    public function validarAcceso(Request $request)
    {
        $validated = $request->validate([
            'codigo' => 'required|numeric',
            'dni' => 'required|string|max:8',
        ]);

        // Verificar si existe el sediprano con el código y DNI proporcionados
        $sediprano = Sediprano::where('codigo', $validated['codigo'])
            ->where('dni', $validated['dni'])
            ->with(['user', 'area'])
            ->first();

        if (!$sediprano) {
            return back()->withErrors([
                'acceso' => 'Credenciales incorrectas. Verifique su código y DNI.'
            ]);
        }

        // Obtener fecha y hora actual
        $ahora = Carbon::now();
        $fechaActual = $ahora->toDateString();
        $horaActual = $ahora->format('H:i:s');

        // Buscar votación activa
        $votacionActiva = Votacion::where('estado', 'activa')
            ->where('fecha', '=', $fechaActual)
            ->where('hora_inicio', '<=', $horaActual)
            ->where('hora_fin', '>=', $horaActual)
            ->first();

        if (!$votacionActiva) {
            return back()->withErrors([
                'acceso' => 'No hay una votación activa en este momento.'
            ]);
        }

        // Verificar si ya votó
        $yaVoto = Voto::where('sediprano_id', $sediprano->id)
            ->where('votacion_id', $votacionActiva->id)
            ->exists();

        if ($yaVoto) {
            return back()->withErrors([
                'acceso' => 'Ya has emitido tu voto en esta votación.'
            ]);
        }

        // Buscar candidatos de la votación
        $candidatos = Candidato::where('votacion_id', $votacionActiva->id)
            ->with(['sediprano.user', 'cargo', 'area'])
            ->get();

        // Redirigir a la página de emisión de voto con los datos necesarios
        return Inertia::render('Votacion/EmitirVoto', [
            'sediprano' => $sediprano,
            'votacion' => $votacionActiva,
            'candidatos' => $candidatos
        ]);
    }

    /**
     * Registra el voto de un sediprano
     */
    public function registrarVoto(Request $request)
    {
        $validated = $request->validate([
            'sediprano_id' => 'required|exists:sedipranos,id',
            'votacion_id' => 'required|exists:votaciones,id',
            'candidato_id' => 'nullable|exists:candidatos,id',
            'es_blanco' => 'required|boolean',
        ]);

        // Verificar si ya votó
        $yaVoto = Voto::where('sediprano_id', $validated['sediprano_id'])
            ->where('votacion_id', $validated['votacion_id'])
            ->exists();

        if ($yaVoto) {
            return back()->withErrors([
                'voto' => 'Ya has emitido tu voto en esta votación.'
            ]);
        }

        // Obtener fecha y hora actual
        $ahora = Carbon::now();
        $fechaActual = $ahora->toDateString();
        $horaActual = $ahora->format('H:i:s');

        // Verificar que la votación esté activa
        $votacionActiva = Votacion::where('id', $validated['votacion_id'])
            ->where('estado', 'activa')
            ->where('fecha', '=', $fechaActual)
            ->where('hora_inicio', '<=', $horaActual)
            ->where('hora_fin', '>=', $horaActual)
            ->first();

        if (!$votacionActiva) {
            return back()->withErrors([
                'voto' => 'La votación no está activa en este momento.'
            ]);
        }

        // Si es voto en blanco, el candidato_id debe ser null
        if ($validated['es_blanco']) {
            $validated['candidato_id'] = null;
        }

        // Registrar el voto
        $voto = Voto::create([
            'sediprano_id' => $validated['sediprano_id'],
            'votacion_id' => $validated['votacion_id'],
            'candidato_id' => $validated['candidato_id'],
            'es_blanco' => $validated['es_blanco'],
            'fecha_voto' => now(),
        ]);

        // Redirigir a una página de confirmación
        return Inertia::render('Votacion/Confirmacion', [
            'mensaje' => 'Voto registrado correctamente',
            'esExitoso' => true
        ]);
    }
}
