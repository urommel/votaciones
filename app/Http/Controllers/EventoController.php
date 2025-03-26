<?php

namespace App\Http\Controllers;

use App\Models\Evento;
use App\Enums\EstadoEvento;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class EventoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        
        $query = Evento::query()
            ->when($search, function ($query, $search) {
                $query->where('nombre', 'like', "%{$search}%")
                    ->orWhere('descripcion', 'like', "%{$search}%")
                    ->orWhere('ubicacion', 'like', "%{$search}%");
            })
            ->orderBy('fecha', 'desc');
        
        $eventos = $query->paginate(8)->withQueryString();
        
        return Inertia::render('Eventos/Index', [
            'eventos' => $eventos,
            'filters' => ['search' => $search],
            'estados' => array_column(EstadoEvento::cases(), 'value'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'fecha' => 'required|date',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
            'estado' => 'required|string|in:' . implode(',', array_column(EstadoEvento::cases(), 'value')),
            'ubicacion' => 'nullable|string|max:255',
        ]);

        Evento::create($validated);

        return Redirect::route('eventos.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Evento $evento)
    {
        return response()->json($evento);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Evento $evento)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'fecha' => 'required|date',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
            'estado' => 'required|string|in:' . implode(',', array_column(EstadoEvento::cases(), 'value')),
            'ubicacion' => 'nullable|string|max:255',
        ]);

        $evento->update($validated);

        return Redirect::route('eventos.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Evento $evento)
    {
        $evento->delete();

        return Redirect::route('eventos.index');
    }
}
