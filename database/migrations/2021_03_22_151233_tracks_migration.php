<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class TracksMigration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tracks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('genre_id')->nullable()->default(null);
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('album_id')->nullable()->default(null);
            $table->string('singer');
            $table->string('name');
            $table->string('cover')->nullable()->default('/img/tracks/default.jpg');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('file_name');
            $table->string('view')->default(0);
            $table->string('popularity')->default(0);
            $table->timestamps();
            $table->foreign('genre_id')->references('id')->on('genres')->onUpdate('cascade')->onDelete('set null');
            $table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('album_id')->references('id')->on('albums')->onUpdate('cascade')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tracks');
    }
}