<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Cargo;
use App\Models\Carrera;
use App\Models\Sediprano;
use App\Models\User;
use App\Enums\Genero;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class SedipranoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        
        $query = Sediprano::with(['user', 'carrera', 'cargo', 'area'])
            ->when($search, function ($query, $search) {
                $query->where('primer_apellido', 'like', "%{$search}%")
                    ->orWhere('segundo_apellido', 'like', "%{$search}%")
                    ->orWhere('codigo', 'like', "%{$search}%")
                    ->orWhere('dni', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($query) use ($search) {
                        $query->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            })
            ->orderBy('primer_apellido');
        
        $sedipranos = $query->paginate(8)->withQueryString();
        
        return Inertia::render('Sedipranos/Index', [
            'sedipranos' => $sedipranos,
            'filters' => ['search' => $search],
            'generos' => array_column(Genero::cases(), 'value'),
            'cargos' => Cargo::all(),
            'areas' => Area::all(),
            'carreras' => Carrera::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'codigo' => 'required|integer|unique:sedipranos',
            'dni' => 'nullable|string|max:8',
            'primer_apellido' => 'required|string|max:255',
            'segundo_apellido' => 'required|string|max:255',
            'carrera_id' => 'nullable|exists:carreras,id',
            'genero' => 'required|string|in:' . implode(',', array_column(Genero::cases(), 'value')),
            'celular' => 'nullable|string|max:9',
            'fecha_nacimiento' => 'nullable|date',
            'user_id' => 'required|exists:users,id',
            'cargo_id' => 'required|exists:cargos,id',
            'area_id' => 'nullable|exists:areas,id',
        ]);

        Sediprano::create($validated);

        return Redirect::route('sedipranos.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Sediprano $sediprano)
    {
        return response()->json($sediprano->load(['user', 'carrera', 'cargo', 'area']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Sediprano $sediprano)
    {
        $validated = $request->validate([
            'codigo' => 'required|integer|unique:sedipranos,codigo,' . $sediprano->id,
            'dni' => 'nullable|string|max:8',
            'primer_apellido' => 'required|string|max:255',
            'segundo_apellido' => 'required|string|max:255',
            'carrera_id' => 'nullable|exists:carreras,id',
            'genero' => 'required|string|in:' . implode(',', array_column(Genero::cases(), 'value')),
            'celular' => 'nullable|string|max:9',
            'fecha_nacimiento' => 'nullable|date',
            'user_id' => 'required|exists:users,id',
            'cargo_id' => 'required|exists:cargos,id',
            'area_id' => 'nullable|exists:areas,id',
        ]);

        $sediprano->update($validated);

        return Redirect::route('sedipranos.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sediprano $sediprano)
    {
        $sediprano->delete();

        return Redirect::route('sedipranos.index');
    }
}
