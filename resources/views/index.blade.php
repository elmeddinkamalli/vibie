<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Laravel</title>
        <link rel="stylesheet" href="{{asset('css/app.css')}}">
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap" rel="stylesheet">
        <meta id="csrf_token" name="csrf-token" content="{{ csrf_token() }}" />
    </head>
    <body>
        <div id="app"></div>
        <script>var wavesurfer = window.WaveSurfer;</script>
        <script src="{{asset('js/app.js')}}"></script>
    </body>
</html>
