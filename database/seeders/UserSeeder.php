<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\User::insert([
            'name'=>'Elmeddin Kamalli',
            "avatar"=> "/img/users/elmeddin-1619600741.png",
            'username' =>'elmeddinkamalli',
            'email'=>'elmeddin@mail.com',
            'about'=>'I\'m just a developer',
            'password'=>'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        ]);
        //\App\Models\User::factory(10)->create();
    }
}
