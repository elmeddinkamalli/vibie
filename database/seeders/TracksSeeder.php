<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class TracksSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\Tracks::insert([
            'album_id'=>1,
            'cover'=>'/img/tracks/paster-yaindiyahec.jpg',
            'created_at'=> '2021-04-28 09:16:39',
            'description'=> 'Track from Bina album',
            'file_name'=>'../tracks/paster-ya-indi-ya-hec.mp3'
        ]);
    }
}
