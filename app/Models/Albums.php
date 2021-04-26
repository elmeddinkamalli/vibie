<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Albums extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'user_id',
        'cover',
        'slug',
        'artist',
        'cover_big',
        'popularity'
    ];

    public function tracks(){
        return $this->hasMany(Tracks::class, 'album_id');
    }
    public function publisher(){
        return $this->belongsTo(User::class, 'user_id');
    }
}
