<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Votacion extends Model
{
    use HasFactory;

    protected $table = 'votaciones';

    protected $fillable = [
        'name',
        'descripcion',
        'fecha',
        'hora_inicio',
        'hora_fin',
        'estado',
        'evento_requerido_id',
    ];

    protected $casts = [
        'fecha' => 'date',
    ];

    public function candidatos()
    {
        return $this->hasMany(Candidato::class);
    }

    public function votos()
    {
        return $this->hasMany(Voto::class);
    }

    public function eventoRequerido()
    {
        return $this->belongsTo(Evento::class, 'evento_requerido_id');
    }

    public function getActivaAttribute()
    {
        $ahora = Carbon::now();
        $fechaActual = $ahora->toDateString();
        $horaActual = $ahora->format('H:i:s');
        
        return $this->fecha->toDateString() === $fechaActual && 
               $this->hora_inicio <= $horaActual && 
               $this->hora_fin >= $horaActual && 
               $this->estado === 'activa';
    }
}
