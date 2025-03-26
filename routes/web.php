<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\AreaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CargoController;
use App\Http\Controllers\VotoController;
use App\Http\Controllers\EventoController;
use App\Http\Controllers\CarreraController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SedipranoController;
use App\Http\Controllers\CandidatoController;
use App\Http\Controllers\VotacionController;
use App\Http\Controllers\AsistenciaController;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('Auth/Login');
})->name('login');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    Route::resource('areas', AreaController::class);
    Route::resource('users', UserController::class);
    Route::resource('cargos', CargoController::class);
    Route::resource('carreras', CarreraController::class);
    Route::resource('sedipranos', SedipranoController::class);
    Route::resource('candidatos', CandidatoController::class);
    Route::resource('votaciones', VotacionController::class);
    Route::resource('votos', VotoController::class);
    Route::resource('eventos', EventoController::class);
    Route::resource('asistencias', AsistenciaController::class);
    
    // Ruta para búsqueda de usuarios para el modal de Sediprano
    Route::get('/api/users/search', [UserController::class, 'search'])->name('api.users.search');
});

require __DIR__.'/auth.php';
