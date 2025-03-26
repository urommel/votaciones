<?php

namespace App\Http\Controllers;

use App\Models\Carrera;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class CarreraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        
        $query = Carrera::query()
            ->when($search, function ($query, $search) {
                $query->where('nombre', 'like', "%{$search}%");
            })
            ->orderBy('nombre');
        
        $carreras = $query->paginate(8)->withQueryString();
        
        return Inertia::render('Carreras/Index', [
            'carreras' => $carreras,
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:carreras',
        ]);

        Carrera::create($validated);

        return Redirect::route('carreras.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Carrera $carrera)
    {
        return response()->json($carrera);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Carrera $carrera)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:carreras,nombre,' . $carrera->id,
        ]);

        $carrera->update($validated);

        return Redirect::route('carreras.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Carrera $carrera)
    {
        $carrera->delete();

        return Redirect::route('carreras.index');
    }
}
