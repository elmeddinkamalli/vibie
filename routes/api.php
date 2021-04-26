<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TracksController;
use App\Http\Controllers\Auth\AuthController;

Route::get('tracks', [TracksController::class, 'get_last_tracks']);
Route::get('track/{slug}', [TracksController::class, 'get_the_track']);
Route::get('genre/{slug}', [TracksController::class, 'get_the_genre_tracks']);
Route::post('tracks/ids', [TracksController::class, 'get_spesific_tracks']);
Route::get('tracks/popular', [TracksController::class, 'get_popular_tracks']);
Route::get('tracks/weeks_popular', [TracksController::class, 'get_weeks_popular_tracks']);
Route::get('genres', [TracksController::class, 'get_genre_infos']);
Route::get('albums', [TracksController::class, 'get_all_albums']);
Route::get('albums/popular', [TracksController::class, 'get_popular_albums']);
Route::get('album/{slug}', [TracksController::class, 'get_the_album']);
Route::POST('tracks/spesific', [TracksController::class, 'get_tracks_spesific']);
Route::get('user/{username}', [TracksController::class, 'get_the_user']);
Route::get('users/{limit?}', [TracksController::class, 'get_all_users']);
Route::POST('users/spesific', [TracksController::class, 'get_users_spesific']);
Route::get('blogs/{limit?}', [TracksController::class, 'get_blogs']);
Route::get('blog/{slug}', [TracksController::class, 'get_the_blog']);
Route::get('gallery/{limit?}', [TracksController::class, 'get_gallery']);
Route::POST('blogs/spesific', [TracksController::class, 'get_blogs_spesific']);
Route::POST('gallery/spesific', [TracksController::class, 'get_gallery_spesific']);
Route::POST('algorithm', [TracksController::class, 'count_the_algorithm']);
Route::get('search/{for?}/{s_query?}/{limit?}', [TracksController::class, 'get_search_results']);
Route::get('followings/{id}', [AuthController::class, 'get_user_followings']);
Route::get('followers/{id}', [AuthController::class, 'get_user_followers']);
Route::get('isauth', [AuthController::class, 'isauth']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('like/track', [TracksController::class, 'detectLike']);
    Route::post('save/track', [TracksController::class, 'detectLike']);
    Route::post('like/album', [TracksController::class, 'detectLike']);
    Route::post('save/album', [TracksController::class, 'detectLike']);
    Route::post('albums/liked', [TracksController::class, 'get_liked_albums']);
    Route::post('tracks/liked', [TracksController::class, 'get_liked_tracks']);
    Route::post('albums/saved', [TracksController::class, 'get_saved_albums']);
    Route::post('tracks/saved', [TracksController::class, 'get_saved_tracks']);
    Route::post('track/create', [TracksController::class, 'create_new_track']);
    Route::post('blog/create', [TracksController::class, 'create_new_blog']);
    Route::post('album/create', [TracksController::class, 'create_new_album']);
    Route::put('user/update', [AuthController::class, 'update_user']);
    Route::post('followunfollow', [AuthController::class, 'follow_unfollow']);
    Route::post('delete', [TracksController::class, 'delete']);
});
Route::group(['middleware' => ['guest:sanctum']], function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::get('login', [AuthController::class, 'login'])->name('login');
});