<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Cargo;
use App\Models\Candidato;
use App\Models\Sediprano;
use App\Models\Votacion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;

class CandidatoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        
        $query = Candidato::with(['sediprano.user', 'cargo', 'area', 'votacion'])
            ->when($search, function ($query, $search) {
                $query->whereHas('sediprano', function ($query) use ($search) {
                    $query->where('primer_apellido', 'like', "%{$search}%")
                        ->orWhere('segundo_apellido', 'like', "%{$search}%")
                        ->orWhere('codigo', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($query) use ($search) {
                            $query->where('name', 'like', "%{$search}%");
                        });
                })
                ->orWhereHas('cargo', function ($query) use ($search) {
                    $query->where('nombre', 'like', "%{$search}%");
                })
                ->orWhereHas('area', function ($query) use ($search) {
                    $query->where('nombre', 'like', "%{$search}%");
                })
                ->orWhereHas('votacion', function ($query) use ($search) {
                    $query->where('nombre', 'like', "%{$search}%");
                });
            })
            ->orderBy('id', 'desc');
        
        $candidatos = $query->paginate(8)->withQueryString();
        
        return Inertia::render('Candidatos/Index', [
            'candidatos' => $candidatos,
            'filters' => ['search' => $search],
            'sedipranos' => Sediprano::with('user')->get(),
            'cargos' => Cargo::all(),
            'areas' => Area::all(),
            'votaciones' => Votacion::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'sediprano_id' => 'required|exists:sedipranos,id',
            'cargo_id' => 'required|exists:cargos,id',
            'area_id' => 'nullable|exists:areas,id',
            'votacion_id' => 'required|exists:votaciones,id',
            'foto' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('candidatos', 'public');
            $validated['foto'] = Storage::url($fotoPath);
        }

        Candidato::create($validated);

        return Redirect::route('candidatos.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Candidato $candidato)
    {
        return response()->json($candidato->load(['sediprano.user', 'cargo', 'area', 'votacion']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Candidato $candidato)
    {
        $validated = $request->validate([
            'sediprano_id' => 'required|exists:sedipranos,id',
            'cargo_id' => 'required|exists:cargos,id',
            'area_id' => 'nullable|exists:areas,id',
            'votacion_id' => 'required|exists:votaciones,id',
            'foto' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('foto')) {
            // Eliminar foto anterior si existe
            if ($candidato->foto) {
                $oldPath = str_replace('/storage', 'public', $candidato->foto);
                Storage::delete($oldPath);
            }
            
            $fotoPath = $request->file('foto')->store('candidatos', 'public');
            $validated['foto'] = Storage::url($fotoPath);
        }

        $candidato->update($validated);

        return Redirect::route('candidatos.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Candidato $candidato)
    {
        // Eliminar foto si existe
        if ($candidato->foto) {
            $path = str_replace('/storage', 'public', $candidato->foto);
            Storage::delete($path);
        }
        
        $candidato->delete();

        return Redirect::route('candidatos.index');
    }
}
