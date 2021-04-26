<?php

namespace Database\Factories;

use App\Models\Blog;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class BlogFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Blog::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $title = $this->faker->sentence(rand(2,10));
        return [
            'user_id'=>rand(1,11),
            'cover'=>'/img/blogs/b2.jpg',
            'title'=>$title,
            'slug'=>Str::slug($title),
            'description'=>$this->faker->sentence(rand(20,60)),
        ];
    }
}
