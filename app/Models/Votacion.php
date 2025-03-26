<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Votacion extends Model
{
    use HasFactory;

    protected $table = 'votaciones';

    protected $fillable = [
        'nombre',
        'descripcion',
        'fecha_inicio',
        'fecha_fin',
        'estado',
    ];

    protected $casts = [
        'fecha_inicio' => 'datetime',
        'fecha_fin' => 'datetime',
    ];

    public function candidatos()
    {
        return $this->hasMany(Candidato::class);
    }

    public function votos()
    {
        return $this->hasMany(Voto::class);
    }

    public function getActivaAttribute()
    {
        $ahora = now();
        return $this->fecha_inicio <= $ahora && $this->fecha_fin >= $ahora && $this->estado === 'activa';
    }
}
