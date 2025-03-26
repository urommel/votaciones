<?php

namespace App\Http\Controllers;

use App\Models\Cargo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class CargoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        
        $query = Cargo::query()
            ->when($search, function ($query, $search) {
                $query->where('nombre', 'like', "%{$search}%")
                    ->orWhere('descripcion', 'like', "%{$search}%");
            })
            ->orderBy('nombre');
        
        $cargos = $query->paginate(8)->withQueryString();
        
        return Inertia::render('Cargos/Index', [
            'cargos' => $cargos,
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:cargos',
            'descripcion' => 'nullable|string',
        ]);

        Cargo::create($validated);

        return Redirect::route('cargos.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Cargo $cargo)
    {
        return response()->json($cargo);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Cargo $cargo)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:cargos,nombre,' . $cargo->id,
            'descripcion' => 'nullable|string',
        ]);

        $cargo->update($validated);

        return Redirect::route('cargos.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cargo $cargo)
    {
        $cargo->delete();

        return Redirect::route('cargos.index');
    }
}
