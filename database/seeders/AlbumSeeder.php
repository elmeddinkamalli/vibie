<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class AlbumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\Albums::insert([
            'name'=>'Bina',
            'artist'=>'Paster',
            'slug'=>'bina',
            'user_id'=>1,
            'popularity'=>90,
            'cover'=>'/img/albums/default.jpg'
        ]);
        \App\Models\Albums::insert([
            'name'=>'Ev',
            'artist'=>'Paster',
            'slug'=>'ev',
            'user_id'=>2,
            'popularity'=>10,
            'cover'=>'/img/albums/default.jpg'
        ]);
        \App\Models\Albums::insert([
            'name'=>'Daxma',
            'artist'=>'Paster',
            'slug'=>'daxma',
            'user_id'=>1,
            'popularity'=>30,
            'cover'=>'/img/albums/default.jpg'
        ]);
        \App\Models\Albums::insert([
            'name'=>'Villa',
            'artist'=>'Paster',
            'slug'=>'villa',
            'user_id'=>1,
            'popularity'=>86,
            'cover'=>'/img/albums/default.jpg'
        ]);
    }
}
