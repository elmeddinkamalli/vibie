<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\Blog::insert([
            "user_id"=>1,
            "cover"=>"/img/blogs/the-best-album-of-alan-walker-1619601126.jpg",
            "title"=>"The best Album of Alan Walker",
            "slug"=>"the-best-album-of-alan-walker",
            "description"=>"Different World is the debut studio album by Norwegian record producer Alan Walker. It was released on 14 December 2018 through MER Musikk and Sony Music Entertainment and includes his successful 2015 single \"Faded\".[2] The album also succeeds a trilogy of releases leading up to the album, entitled World of Walker, which consisted of the singles \"All Falls Down\", \"Darkside\" and \"Diamond Heart\".\n\nFeaturing artists such as Steve Aoki, Noah Cyrus, and Digital Farm Animals, the album is noted for its mixture of \"recognizable releases\" such as \"Faded\" with \"new material\" such as \"Lost Control\". Walker said of the album \"It's an incredible feeling to be able to release my debut album, Different World.",
            "created_at"=>"2021-04-28T09:12:07.000000Z",
            "updated_at"=>"2021-04-28T09:12:07.000000Z",
        ]);
        \App\Models\Blog::insert([
            "user_id"=>1,
            "cover"=>"/img/blogs/pasters-new-album-released-1619600974.png",
            "title"=>"Paster's new Album released",
            "slug"=>"pasters-new-album-released",
            "description"=>"Paster's new Album called \"Bina\" published. It contains 5 tracks. Hurry up and check those tracks.",
            "created_at"=>"2021-04-28T09:09:34.000000Z",
            "updated_at"=>"2021-04-28T09:09:34.000000Z",
        ]);
    }
}
