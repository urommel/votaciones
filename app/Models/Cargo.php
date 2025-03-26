<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cargo extends Model
{
    protected $table = 'cargos';

    protected $fillable = [
        'nombre',
        'descripcion'
    ];

    public function candidatos()
    {
        return $this->hasMany(Candidato::class);
    }
}
