<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class GenreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\Genres::insert([
            'name'=>'Classic',
            'slug'=>'classic',
        ]);
        \App\Models\Genres::insert([
            'name'=>'Country',
            'slug'=>'country',
        ]);
        \App\Models\Genres::insert([
            'name'=>'Electronic',
            'slug'=>'electronic',
        ]);
        \App\Models\Genres::insert([
            'name'=>'Indie rock',
            'slug'=>'indie-rock',
        ]);
        \App\Models\Genres::insert([
            'name'=>'K-pop',
            'slug'=>'k-pop',
        ]);
        \App\Models\Genres::insert([
            'name'=>'Metal',
            'slug'=>'metal',
        ]);
        \App\Models\Genres::insert([
            'name'=>'Pop',
            'slug'=>'pop',
        ]);
        \App\Models\Genres::insert([
            'name'=>'Rap',
            'slug'=>'rap',
        ]);
        \App\Models\Genres::insert([
            'name'=>'Rhytm & blues',
            'slug'=>'rhytm-and-blues',
        ]);
        \App\Models\Genres::insert([
            'name'=>'Rock',
            'slug'=>'rock',
        ]);
    }
}
