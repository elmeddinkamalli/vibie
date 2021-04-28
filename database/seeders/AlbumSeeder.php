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
        \App\Models\Albums::insert([
            "user_id"=>1,
            "name"=>"Different World",
            "artist"=>"Alan Walker",
            "description"=>"Different World is the debut studio album by Norwegian record producer Alan Walker. It was released on 14 December 2018 through MER Musikk and Sony Music Entertainment and includes his successful 2015 single \"Faded\". The album also succeeds a trilogy of releases leading up to the album, entitled World of Walker, which consisted of the singles \"All Falls Down\", \"Darkside\" and \"Diamond Heart\".",
            "slug"=>"different-world-alan-walker",
            "cover"=>"/img/albums/different-world-1619599291.jpg",
            "cover_big"=>"/img/albums/different-world-1619599291-big.jpg",
            "popularity"=>"0",
            "created_at"=>"2021-04-28T08:41:32.000000Z",
            "updated_at"=>"2021-04-28T08:41:32.000000Z",
        ]);
    }
}
