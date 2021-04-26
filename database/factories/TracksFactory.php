<?php

namespace Database\Factories;

use App\Models\Tracks;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TracksFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Tracks::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $singer = $this->faker->sentence(rand(1,3));
        $name = $this->faker->sentence(rand(1,5));
        $tracks = ['../tracks/Mind The Rift.mp3', '../tracks/next.mp3', '../tracks/cold.mp3', '../tracks/prev.mp3', '../tracks/salzburg.mp3', '../tracks/uuu u uuu.mp3', '../tracks/guitar.mp3', '../tracks/du du.mp3',];
        return [
            'user_id'=>rand(1,11),
            'genre_id'=>rand(1,4),
            'album_id'=>rand(1,4),
            'singer'=>$singer,
            'name'=>$name,
            'slug'=> Str::slug($singer).'-'.Str::slug($name),
            'file_name'=>$tracks[rand(0,6)],
            'popularity'=>rand(0,100),
        ];
    }
}
