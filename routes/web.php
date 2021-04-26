<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('index');
});
Route::get('/home', function () {
    return view('index');
});
Route::get('/genres', function () {
    return view('index');
});
Route::get('/track/{slug}', function () {
    return view('index');
});
Route::get('/genre/{slug}', function () {
    return view('index');
});
Route::get('/albums', function () {
    return view('index');
});
Route::get('/album/{slug}', function () {
    return view('index');
});
Route::get('/user/{username}', function () {
    return view('index');
});
Route::get('/users', function () {
    return view('index');
});
Route::get('/blogs', function () {
    return view('index');
});
Route::get('/blog/{slug}', function () {
    return view('index');
});
Route::get('/gallery', function () {
    return view('index');
});
Route::get('/search/{s_query?}', function () {
    return view('index');
});
Route::get('/login', function () {
    return view('index');
});
Route::get('/register', function () {
    return view('index');
});
Route::get('/likes', function () {
    return view('index');
});
Route::get('/saves', function () {
    return view('index');
});
Route::get('/settings', function () {
    return view('index');
});
