<?php

namespace App\Http\Controllers;

use App\Models\Votacion;
use App\Enums\EstadoVotacion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Carbon\Carbon;

class VotacionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        
        $query = Votacion::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('descripcion', 'like', "%{$search}%");
            })
            ->orderBy('fecha', 'desc');
        
        $votaciones = $query->paginate(8)->withQueryString();
        
        return Inertia::render('Votaciones/Index', [
            'votaciones' => $votaciones,
            'filters' => ['search' => $search],
            'estados' => array_column(EstadoVotacion::cases(), 'value'),
            'eventos' => \App\Models\Evento::select('id', 'nombre')->orderBy('nombre')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'fecha' => 'required|date',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
            'descripcion' => 'nullable|string',
            'estado' => 'required|string|in:' . implode(',', array_column(EstadoVotacion::cases(), 'value')),
            'evento_requerido_id' => 'nullable|exists:eventos,id'
        ]);

        Votacion::create($validated);
    }

    /**
     * Display the specified resource.
     */
    public function show(Votacion $votacion)
    {
        return response()->json($votacion);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Votacion $votacion)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'fecha' => 'required|date',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
            'descripcion' => 'nullable|string',
            'estado' => 'required|string|in:' . implode(',', array_column(EstadoVotacion::cases(), 'value')),
            'evento_requerido_id' => 'nullable|exists:eventos,id'
        ]);

        $votacion->update($validated);

        return Redirect::route('votaciones.index')->with('success', 'Votación actualizada correctamente');
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Votacion $votacion)
    {
        $votacion->delete();

        return Redirect::route('votaciones.index')->with('success', 'Votación eliminada correctamente');
    }
}
