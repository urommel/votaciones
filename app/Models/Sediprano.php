<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;
use App\Models\Cargo;
use App\Models\Carrera;
use App\Models\Area;

class Sediprano extends Model
{
    use HasFactory;

    protected $fillable = [
        'codigo',
        'dni',
        'primer_apellido',
        'segundo_apellido',
        'carrera_id',
        'genero',
        'celular',
        'fecha_nacimiento',
        'user_id',
        'cargo_id',
        'area_id',
        'qr_code',
        'qr_path',
        'secret_key',
        'token',
        'qr_hash',
    ];

    protected $casts = [
        'fecha_nacimiento' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function carrera(): BelongsTo
    {
        return $this->belongsTo(Carrera::class);
    }

    public function cargo(): BelongsTo
    {
        return $this->belongsTo(Cargo::class);
    }

    public function area(): BelongsTo
    {
        return $this->belongsTo(Area::class);
    }

    public function candidaturas()
    {
        return $this->hasMany(Candidato::class);
    }

    public function asistencias()
    {
        return $this->hasMany(Asistencia::class);
    }

    public function votos()
    {
        return $this->hasMany(Voto::class);
    }
}
