<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LikedAlbums extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'album_id',
    ];

    public function album(){
        return $this->hasMany(Albums::class, 'id', 'album_id');
    }
}
