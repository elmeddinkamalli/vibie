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
            "user_id"=>1,
            "name"=>"Bina",
            "artist"=>"Paster",
            "description"=>"Bina – azərbaycanlı reper Pasterin ikinci studiya albomu. Album 2020-ci ildə dinləyicilərinə qovuşub. Albom uzun müddət musiqi çartlarında ilk pillələrdə qərarlaşmışdır.",
            "slug"=>"bina-paster",
            "cover"=>"/img/albums/bina-1619590510.png",
            "cover_big"=>"/img/albums/bina-1619590510-big.png",
            "popularity"=>"0",
            "created_at"=>"2021-04-28T06:15:10.000000Z",
            "updated_at"=>"2021-04-28T06:15:10.000000Z",
        ]);
    }
}
