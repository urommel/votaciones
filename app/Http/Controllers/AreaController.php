<?php

namespace App\Http\Controllers;

use App\Models\Area;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AreaController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $page = $request->input('page', 1);
        $perPage = 8;

        $areas = Area::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nombre', 'like', "%{$search}%")
                      ->orWhere('abreviatura', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
        
        return Inertia::render('Areas/Index', [
            'areas' => $areas,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'abreviatura' => 'required|string|max:10|unique:areas',
        ]);

        Area::create($validated);

        return redirect()->back()->with('success', 'Área creada exitosamente');
    }

    public function update(Request $request, Area $area)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'abreviatura' => 'required|string|max:10|unique:areas,abreviatura,' . $area->id,
        ]);

        $area->update($validated);

        return redirect()->back()->with('success', 'Área actualizada exitosamente');
    }

    public function destroy(Area $area)
    {
        $area->delete();
        return redirect()->back()->with('success', 'Área eliminada exitosamente');
    }
}
