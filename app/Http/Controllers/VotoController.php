<?php

namespace App\Http\Controllers;

use App\Models\Voto;
use App\Models\Votacion;
use App\Models\Sediprano;
use App\Models\Candidato;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class VotoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $votacionId = $request->input('votacion_id', null);
        $search = $request->input('search', '');
        
        $query = Voto::with(['sediprano.user', 'candidato.sediprano.user', 'votacion'])
            ->when($votacionId, function ($query, $votacionId) {
                $query->where('votacion_id', $votacionId);
            })
            ->when($search, function ($query, $search) {
                $query->whereHas('sediprano.user', function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('candidato.sediprano.user', function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('votacion', function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%");
                });
            })
            ->orderBy('fecha_voto', 'desc');
        
        $votos = $query->paginate(8)->withQueryString();
        
        return Inertia::render('Votos/Index', [
            'votos' => $votos,
            'filters' => [
                'search' => $search,
                'votacion_id' => $votacionId
            ],
            'votaciones' => Votacion::all(),
            'sedipranos' => Sediprano::with('user')->get(),
            'candidatos' => Candidato::with(['sediprano.user', 'cargo', 'area'])->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'sediprano_id' => 'required|exists:sedipranos,id',
            'es_blanco' => 'required|boolean',
            'candidato_id' => 'nullable|required_if:es_blanco,false|exists:candidatos,id',
            'votacion_id' => 'required|exists:votaciones,id',
        ]);

        // Verificar si el sediprano ya votó en esta votación
        $existeVoto = Voto::where('sediprano_id', $validated['sediprano_id'])
            ->where('votacion_id', $validated['votacion_id'])
            ->exists();

        if ($existeVoto) {
            return back()->withErrors(['sediprano_id' => 'Este Sediprano ya ha emitido su voto en esta votación.']);
        }

        // Si es voto en blanco, asegurarse de que candidato_id sea null
        if ($validated['es_blanco']) {
            $validated['candidato_id'] = null;
        }

        Voto::create($validated);

        return Redirect::route('votos.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Voto $voto)
    {
        return response()->json($voto->load(['sediprano.user', 'candidato.sediprano.user', 'votacion']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Voto $voto)
    {
        $voto->delete();

        return Redirect::route('votos.index');
    }
}
