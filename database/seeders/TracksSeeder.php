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
            "genre_id"=>8,
            "user_id"=>1,
            "album_id"=>1,
            "singer"=>"Paster",
            "name"=>"Ya indi, ya heç vaxt",
            "cover"=>"/img/tracks/ya-indi-ya-hec-vaxt-1619589939.png",
            "slug"=>"paster-ya-indi-ya-hec-vaxt",
            "description"=>"Track from Bina album",
            "file_name"=>"../tracks/ya-indi-ya-hec-vaxt1619589940.mp3",
            "view"=>"0",
            "popularity"=>"0",
            "created_at"=>"2021-04-24T06:05:40.000000Z",
            "updated_at"=>"2021-04-28T06:29:40.000000Z",
        ]);
        \App\Models\Tracks::insert([
            "genre_id"=>8,
            "user_id"=>1,
            "album_id"=>1,
            "singer"=>"Paster",
            "name"=>"Gəzirəm",
            "cover"=>"/img/tracks/gezirem-1619590036.png",
            "slug"=>"paster-gezirem",
            "description"=>"Melancolic track",
            "file_name"=>"../tracks/gezirem1619590036.mp3",
            "view"=>"0",
            "popularity"=>"0",
            "created_at"=>"2021-04-25T06:07:16.000000Z",
            "updated_at"=>"2021-04-28T06:25:24.000000Z",
        ]);
        \App\Models\Tracks::insert([
            "genre_id"=>8,
            "user_id"=>1,
            "album_id"=>1,
            "singer"=>"Paster",
            "name"=>"Yenidən",
            "cover"=>"/img/tracks/yeniden-1619590107.png",
            "slug"=>"paster-yeniden",
            "description"=>null,
            "file_name"=>"../tracks/yeniden1619590107.mp3",
            "view"=>"0",
            "popularity"=>"0",
            "created_at"=>"2021-04-26T06:08:27.000000Z",
            "updated_at"=>"2021-04-28T06:21:51.000000Z",
        ]);
        \App\Models\Tracks::insert([
            "genre_id"=>8,
            "user_id"=>1,
            "album_id"=>1,
            "singer"=>"Paster",
            "name"=>"Chain (feat. Saybu Swag)",
            "cover"=>"/img/tracks/chain-feat-saybu-swag-1619590191.png",
            "slug"=>"paster-chain-feat-saybu-swag",
            "description"=>null,
            "file_name"=>"../tracks/chain-feat-saybu-swag1619590191.mp3",
            "view"=>"0",
            "popularity"=>"0",
            "created_at"=>"2021-04-27T06:09:51.000000Z",
            "updated_at"=>"2021-04-28T06:18:49.000000Z",
        ]);
        \App\Models\Tracks::insert([
            "genre_id"=>8,
            "user_id"=>1,
            "album_id"=>1,
            "singer"=>"Paster",
            "name"=>"Qayıt gəl (feat. OD)",
            "cover"=>"/img/tracks/qayit-gel-feat-od-1619590301.png",
            "slug"=>"paster-qayit-gel-feat-od",
            "description"=>"Catchy track",
            "file_name"=>"../tracks/qayit-gel-feat-od1619590301.mp3",
            "view"=>"0",
            "popularity"=>"0",
            "created_at"=>"2021-04-28T06:11:41.000000Z",
            "updated_at"=>"2021-04-28T06:15:26.000000Z",
        ]);
    }
}
