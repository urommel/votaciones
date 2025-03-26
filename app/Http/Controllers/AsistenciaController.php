<?php

namespace App\Http\Controllers;

use App\Models\Asistencia;
use App\Models\Evento;
use App\Models\Sediprano;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class AsistenciaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $eventoId = $request->input('evento_id', null);
        $search = $request->input('search', '');
        
        $query = Asistencia::with(['sediprano.user', 'evento'])
            ->when($eventoId, function ($query, $eventoId) {
                $query->where('evento_id', $eventoId);
            })
            ->when($search, function ($query, $search) {
                $query->whereHas('sediprano.user', function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('evento', function ($query) use ($search) {
                    $query->where('nombre', 'like', "%{$search}%");
                });
            })
            ->orderBy('hora_registro', 'desc');
        
        $asistencias = $query->paginate(8)->withQueryString();
        
        return Inertia::render('Asistencias/Index', [
            'asistencias' => $asistencias,
            'filters' => [
                'search' => $search,
                'evento_id' => $eventoId
            ],
            'eventos' => Evento::all(),
            'sedipranos' => Sediprano::with('user')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'evento_id' => 'required|exists:eventos,id',
            'sediprano_id' => 'required|exists:sedipranos,id',
            'hora_registro' => 'required|date',
            'estado' => 'required|in:presente,tardanza,falta',
            'observacion' => 'nullable|string',
        ]);

        // Verificar si el sediprano ya tiene asistencia registrada para este evento
        $existe = Asistencia::where('evento_id', $validated['evento_id'])
            ->where('sediprano_id', $validated['sediprano_id'])
            ->exists();

        if ($existe) {
            return back()->withErrors(['sediprano_id' => 'Este Sediprano ya tiene asistencia registrada en este evento.']);
        }

        Asistencia::create($validated);

        return Redirect::route('asistencias.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Asistencia $asistencia)
    {
        return response()->json($asistencia->load(['sediprano.user', 'evento']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Asistencia $asistencia)
    {
        $validated = $request->validate([
            'evento_id' => 'required|exists:eventos,id',
            'sediprano_id' => 'required|exists:sedipranos,id',
            'hora_registro' => 'required|date',
            'estado' => 'required|in:presente,tardanza,falta',
            'observacion' => 'nullable|string',
        ]);

        // Verificar que no exista otra asistencia con ese evento y sediprano (excepto la actual)
        $existe = Asistencia::where('evento_id', $validated['evento_id'])
            ->where('sediprano_id', $validated['sediprano_id'])
            ->where('id', '!=', $asistencia->id)
            ->exists();

        if ($existe) {
            return back()->withErrors(['sediprano_id' => 'Este Sediprano ya tiene asistencia registrada en este evento.']);
        }

        $asistencia->update($validated);

        return Redirect::route('asistencias.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Asistencia $asistencia)
    {
        $asistencia->delete();

        return Redirect::route('asistencias.index');
    }
}
