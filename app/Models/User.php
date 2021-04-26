<?php

namespace App\Models;

//use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'adress',
        'phone_number',
        'about',
        'avatar'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function tracks(){
        return $this->hasMany('App\Models\Tracks');
    }

    public function blogs(){
        return $this->hasMany('App\Models\Blog');
    }

    function followings(){
        return $this->hasMany(Follows::class, 'follower', 'id');
    }

    function followers(){
        return $this->hasMany(Follows::class, 'following', 'id')->orderBy('created_at', 'DESC');;
    }
}
