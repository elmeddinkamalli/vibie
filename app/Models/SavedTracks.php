<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavedTracks extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'track_id',
    ];

    public function track(){
        return $this->hasOne(Tracks::class, 'id', 'track_id');
    }
}
