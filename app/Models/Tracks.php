<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Tracks extends Model
{
    use HasFactory, HasApiTokens;

    protected $fillable = [
        "user_id",
        "genre_id",
        "name",
        "singer",
        "description",
        "slug",
        "file_name",
        "popularity",
        "cover",
        "view"
    ];

    public function publisher(){
        return $this->belongsTo(User::class, 'user_id');
    }

    public function album(){
        return $this->belongsTo(Albums::class, 'album_id');
    }

    public function likes(){
        return $this->hasMany(LikedTracks::class, 'track_id');
    }
}
