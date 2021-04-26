<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Genres extends Model
{
    use HasFactory;

    protected $fillable = ['id','name', 'tracks'];

    public $timestamps = true;

    // public $appends = ['data'];

    // public function getDataAttribute()
    // {
    //     return "qaqa";
    // }

    public function tracks(){
        return $this->hasMany(Tracks::class, 'genre_id', 'id');
    }
}
