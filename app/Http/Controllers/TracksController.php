<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\TrackRequest;
use App\Http\Requests\BlogRequest;
use App\Http\Requests\AlbumValidation;
use Illuminate\Support\Str;
use Intervention\Image\ImageManagerStatic as Image;
use Illuminate\Support\Facades\Auth;
use App\Models\Tracks;
use App\Models\Genres;
use App\Models\Albums;
use App\Models\User;
use App\Models\Blog;
use App\Models\LikedTracks;
use App\Models\LikedAlbums;
use App\Models\SavedTracks;
use App\Models\SavedAlbums;
use App\Models\Follows;
use File;

class TracksController extends Controller
{
    function get_last_tracks(){
        $tracks = Tracks::with('publisher')->orderBy('created_at', 'DESC')->get()->take(20);
        if(auth()->user()){
            $user_id = auth()->user()->id;

            if($tracks){
                $tracks = $tracks->map(function($track)use($user_id){
                    return $this->isLiked(collect($track)->toArray(), $user_id);
                });
                $tracks = $tracks->map(function($track)use($user_id){
                    return $this->isSaved(collect($track)->toArray(), $user_id);
                });
            }
        }

        return $tracks;
    }

    function get_popular_tracks(){
        $tracks = Tracks::with('publisher')->orderBy('popularity', 'DESC')->get()->take(20);

        if(auth()->user()){
            $user_id = auth()->user()->id;

            if($tracks){
                $tracks = $tracks->map(function($track)use($user_id){
                    return $this->isLiked(collect($track)->toArray(), $user_id);
                });
                $tracks = $tracks->map(function($track)use($user_id){
                    return $this->isSaved(collect($track)->toArray(), $user_id);
                });
            }
        }

        return $tracks;
    }

    function get_spesific_tracks(Request $request){
        $ids = $request->get('ids');
        $ids_ordered = implode(',', $ids);
        return Tracks::with('publisher')->whereIn('id', $ids)->orderByRaw("FIELD(id, $ids_ordered)")->get();
    }

    function get_weeks_popular_tracks(){
        $genres = Genres::whereHas('tracks')->with(['tracks' => function($query){
            return $query->orderBy('popularity', 'DESC')->take(40)->get();
        }])->get()->map(function($genre) {
            $genre->setRelation('tracks', $genre->tracks->take(7));
            return $genre;
        });

        if(auth()->user()){
            $user_id = auth()->user()->id;

            if($genres){
                $genres = json_decode($genres, true);
                foreach ($genres as $key => $genre) {
                    $newGenre = collect($genre['tracks'])->map(function($track)use($user_id){
                        return $this->isLiked(collect($track)->toArray(), $user_id);
                    });
                    $newGenre = collect($newGenre)->map(function($track)use($user_id){
                        return $this->isSaved(collect($track)->toArray(), $user_id);
                    });
                    $genres[$key]['tracks'] = $newGenre;
                }
                $genres = collect((object)$genres);
            };
        }

        $all = $genres->map(function($genre){
            return $genre['tracks'];
        });
        $all = str_replace(array('[', ']'), '' , $all);
        $all = collect(json_decode('['.$all.']'))->toArray();
        $all = collect($all)->sortByDesc('popularity')->values();
        $instance = new Genres([
            'id'=>0,
            'name'=>'all',
            'tracks'=> array_values(collect($all)->toArray())
        ]);
        $genres->put(count($genres), $instance);
        $array = json_decode($genres, true);
        usort($array, function($a, $b) {
            return $a['id'] <=> $b['id'];
        });
        return $array;
    }

    function get_the_track($slug){
        $track = Tracks::where('slug', $slug)->with('publisher')->with('album')->first();
        $related_tracks = null;

        if($track){
            $related_tracks = Tracks::where(function ($q) use ($track, $slug) {
                $q->where('slug', $slug)->orWhere('user_id', $track['user_id'])->orWhere('genre_id', $track['genre_id']);
            })->orderByRaw("FIELD(id, ".(int)$track['id'].")". " DESC")->get()->take(20);
        }

        if(auth()->user()){
            $user_id = auth()->user()->id;

            if($track){
                $isLiked = LikedTracks::select('user_id')->where('track_id',$track['id'])->where('user_id',$user_id)->first();
                if($isLiked){
                    $liked = array('isLiked' => true);
                    $track = array_merge(collect($track)->toArray(), $liked);
                }
                $isSaved = SavedTracks::select('user_id')->where('track_id',$track['id'])->where('user_id',$user_id)->first();
                if($isSaved){
                    $saved = array('isSaved' => true);
                    $track = array_merge(collect($track)->toArray(), $saved);
                }
            }

            if($related_tracks){
                $related_tracks = $related_tracks->map(function($track)use($user_id){
                    return $this->isLiked($track, $user_id);
                });
                $related_tracks = $related_tracks->map(function($track)use($user_id){
                    return $this->isSaved($track, $user_id);
                });
            }
        }
        return array(
            'track' => $track,
            'related_tracks' => $related_tracks,
        );
    }

    function isLiked($data, $user_id, $album=false){
        if($album){
            $isLiked2 = LikedAlbums::select('user_id')->where('album_id',$data['id'])->where('user_id',$user_id)->first();
        }else{
            $isLiked2 = LikedTracks::select('user_id')->where('track_id',$data['id'])->where('user_id',$user_id)->first();
        }
        if($isLiked2){
            $liked = array('isLiked' => true);
            return array_merge(collect($data)->toArray(), $liked);
        }else{
            $liked = array('isLiked' => false);
            return array_merge(collect($data)->toArray(), $liked);
        }
    }

    function isSaved($data, $user_id, $album=false){
        if($album){
            $isSaved2 = SavedAlbums::select('user_id')->where('album_id',$data['id'])->where('user_id',$user_id)->first();
        }else{
            $isSaved2 = SavedTracks::select('user_id')->where('track_id',$data['id'])->where('user_id',$user_id)->first();
        }
        if($isSaved2){
            $saved = array('isSaved' => true);
            return array_merge(collect($data)->toArray(), $saved);
        }else{
            $saved = array('isSaved' => false);
            return array_merge(collect($data)->toArray(), $saved);
        }
    }

    function get_genre_infos(){
        return Genres::withCount('tracks')->get();
    }

    function get_all_albums(){
        $albums = Albums::withCount('tracks')->get();
        if(auth()->user()){
            $user_id = auth()->user()->id;
            if($albums){
                $albums = $albums->map(function($album)use($user_id){
                    return $this->isLiked(collect($album)->toArray(), $user_id, true);
                });
                $albums = $albums->map(function($album)use($user_id){
                    return $this->isSaved(collect($album)->toArray(), $user_id, true);
                });
            }
        }
        return $albums;
    }
    
    function get_all_users(Request $request){
        if($request->limit){
            return $users = User::withCount('tracks')->get()->take(3);
        }else{
            return $users = User::whereHas('tracks')->withCount('tracks')->get()->take(20);
        }
    }

    function get_popular_albums(){
        return Albums::orderBy('popularity', 'DESC')->get()->take(5);
    }

    function get_the_genre_tracks($slug){
        $genre = Genres::where('slug', $slug)->first();
        $tracks = Tracks::where('genre_id', $genre->id)->orderBy('created_at', 'DESC')->get()->take(20);
        if(auth()->user()){
            $user_id = auth()->user()->id;

            if($tracks){
                $tracks = $tracks->map(function($track)use($user_id){
                    return $this->isLiked(collect($track)->toArray(), $user_id);
                });
                $tracks = $tracks->map(function($track)use($user_id){
                    return $this->isSaved(collect($track)->toArray(), $user_id);
                });
            }
        }

        return array(
            'genre' => $genre,
            'tracks' => $tracks,
        );
    }

    function get_the_album($slug){
        $album = Albums::where('slug', $slug)->with('publisher')->first();
        
        $tracks = Tracks::where('album_id', $album->id)->orderBy('created_at', 'DESC')->get()->take(20);
        if(auth()->user()){
            $user_id = auth()->user()->id;

            if($album){
                $isLiked = LikedAlbums::select('user_id')->where('album_id',$album->id)->where('user_id',$user_id)->first();
                if($isLiked){
                    $liked = array('isLiked' => true);
                    $album = array_merge(collect($album)->toArray(), $liked);
                }
                $isSaved = SavedAlbums::select('user_id')->where('album_id',$album['id'])->where('user_id',$user_id)->first();
                if($isSaved){
                    $saved = array('isSaved' => true);
                    $album = array_merge(collect($album)->toArray(), $saved);
                }
            }
            if($tracks){
                $tracks = $tracks->map(function($track)use($user_id){
                    return $this->isLiked(collect($track)->toArray(), $user_id);
                });
                $tracks = $tracks->map(function($track)use($user_id){
                    return $this->isSaved(collect($track)->toArray(), $user_id);
                });
            }
        }
        return array(
            'album' => $album,
            'tracks' => $tracks,
        );
    }
    
    function get_the_user($username){
        $artist = User::where('username', $username)->withCount('tracks')->with('blogs')->with('followers')->withCount('followings')->withCount('followers')->first();
        $this->user_ids = array();
        if($artist){
            $artist->followers->map(function($follower){
                return array_push($this->user_ids, $follower->follower);
            });
            $last_followers = User::select('username', 'avatar')->whereIn('id',$this->user_ids)->get()->take(5);
            $tracks = Tracks::where('user_id', $artist->id)->orderBy('created_at', 'DESC')->get();
            $albums = Albums::where('user_id', $artist->id)->orderBy('created_at', 'DESC')->get();
            if(auth()->user()){
                $user_id = auth()->user()->id;

                $follow = Follows::select('id')->where('following',$artist->id)->where('follower',$user_id)->first();
                if($follow){
                    $following = array('follow' => true);
                    $artist = array_merge(collect($artist)->toArray(), $following);
                }

                if($tracks){
                    $tracks = $tracks->map(function($track)use($user_id){
                        return $this->isLiked(collect($track)->toArray(), $user_id);
                    });
                    $tracks = $tracks->map(function($track)use($user_id){
                        return $this->isSaved(collect($track)->toArray(), $user_id);
                    });
                }
                if($albums){
                    $albums = $albums->map(function($album)use($user_id){
                        return $this->isLiked(collect($album)->toArray(), $user_id, true);
                    });
                    $albums = $albums->map(function($album)use($user_id){
                        return $this->isSaved(collect($album)->toArray(), $user_id, true);
                    });
                }
            }
            return array(
                'artist' => $artist,
                'tracks' => $tracks,
                'albums' => $albums,
                'last_followers'=>array_reverse($last_followers->toArray())
            );
        }
    }

    function get_tracks_spesific(Request $request){
        if($request->genre_id && $request->created_at){
            return Tracks::where([
                ['genre_id', '=', $request->genre_id],
                ['created_at','<', date($request->created_at)],
            ])->orderBy('created_at', 'DESC')->get()->take(20);
        }
    }

    function get_users_spesific(Request $request){
        $ids = $request->get('ids');
        return $users = User::whereNotIn('id', $ids)->whereHas('tracks')->withCount('tracks')->get()->take(20);
    }

    function get_blogs(Request $request){
        if($request->limit){
            return Blog::with('user')->orderBy('created_at', 'DESC')->get()->take($request->limit);
        }else{
            return Blog::with('user')->orderBy('created_at', 'DESC')->get();
        }
    }
    function get_gallery(Request $request){
        $gallery = [];
        if($request->limit){
            return $gallery = Blog::whereNotNull('cover')->select('id','cover', 'created_at')->orderBy('created_at', 'DESC')->get()->take($request->limit);
        }else{
            return $gallery = Blog::whereNotNull('cover')->select('id','cover', 'created_at')->orderBy('created_at', 'DESC')->get();
        }
    }

    function get_the_blog($slug){
        return Blog::where('slug', $slug)->with('user')->first();
    }

    function get_blogs_spesific(Request $request){
        if($request->created_at){
            return Blog::with('user')->where([
                ['created_at','<', date($request->created_at)],
            ])->orderBy('created_at', 'DESC')->get()->take(10);
        }
    }
    
    function get_gallery_spesific(Request $request){
        if($request->created_at){
            return Blog::whereNotNull('cover')->select('id','cover', 'created_at')->where([
                ['created_at','<', date($request->created_at)],
            ])->orderBy('created_at', 'DESC')->get()->take(12);
        }
    }

    function get_search_results(Request $request){
        if($request->for && $request->for === "users"){
            return $users = User::where('name', 'like', '%'.$request->s_query.'%')->orWhere('username', 'like', '%'.$request->s_query.'%')->withCount('tracks')->get()->take($request->limit);
        }else{
            $users = User::where('name', 'like', '%'.$request->s_query.'%')
                        ->orWhere('username', 'like', '%'.$request->s_query.'%')
                        ->withCount('tracks')->get();
            $tracks = Tracks::where('name', 'like', '%'.$request->s_query.'%')
                        ->orWhere('singer', 'like', '%'.$request->s_query.'%')
                        ->orWhere('description', 'like', '%'.$request->s_query.'%')->get();
            if(auth()->user()){
                $user_id = auth()->user()->id;
    
                if($tracks){
                    $tracks = $tracks->map(function($track)use($user_id){
                        return $this->isLiked(collect($track)->toArray(), $user_id);
                    });
                    $tracks = $tracks->map(function($track)use($user_id){
                        return $this->isSaved(collect($track)->toArray(), $user_id);
                    });
                }
            }
            return array(
                'users'=>$users,
                'tracks'=>$tracks
            );
        }
    }

    function detectLike(Request $request){
        if(auth()->user()){
            if($request->for === "like"){
                $track = Tracks::where('id', $request->id)->first();
                if($track){
                    $profileLikedPosts = LikedTracks::where('user_id', auth()->user()->id)->get()->map(function($query) use($request){
                        return $query->where('track_id', $request->id)->first();
                    })->first();
                    if($profileLikedPosts){
                        return $this->unlike($profileLikedPosts);
                    }else{
                        return $this->like($request->id, $request->for);
                    }
                };
            }else if($request->for === "save"){
                $track = Tracks::where('id', $request->id)->first();
                if($track){
                    $profileSavedPosts = SavedTracks::where('user_id', auth()->user()->id)->get()->map(function($query) use($request){
                        return $query->where('track_id', $request->id)->first();
                    })->first();
                    if($profileSavedPosts){
                        return $this->unsave($profileSavedPosts);
                    }else{
                        return $this->save($request->id, $request->for);
                    }
                };
            }else if($request->for === "likealbum"){
                $album = Albums::where('id', $request->id)->first();
                if($album){
                    $profileLikedPosts = LikedAlbums::where('user_id', auth()->user()->id)->get()->map(function($query) use($request){
                        return $query->where('album_id', $request->id)->first();
                    })->first();
                    if($profileLikedPosts){
                        return $this->unlike($profileLikedPosts);
                    }else{
                        return $this->like($request->id, $request->for);
                    }
                };
            }else if($request->for === "savealbum"){
                $album = Albums::where('id', $request->id)->first();
                if($album){
                    $profileSavedPosts = SavedAlbums::where('user_id', auth()->user()->id)->get()->map(function($query) use($request){
                        return $query->where('album_id', $request->id)->first();
                    })->first();
                    if($profileSavedPosts){
                        return $this->unsave($profileSavedPosts);
                    }else{
                        return $this->save($request->id, $request->for);
                    }
                };
            }
        }else{
            return "please log in";
        }
    }

    function like($track_id, $for){
        if($for === "like"){
            $like = LikedTracks::create([
                'user_id'=>auth()->user()->id,
                'track_id'=>$track_id,
            ]);
        }else if($for === "likealbum"){
            $like = LikedAlbums::create([
                'user_id'=>auth()->user()->id,
                'album_id'=>$track_id,
            ]);
        }
        if($like){
            return "liked";
        }
    }

    function unlike($data){
        if($data->delete()){
            return "unliked";
        }
    }

    function save($id, $for){
        if($for === "save"){
            $save = SavedTracks::create([
                'user_id'=>auth()->user()->id,
                'track_id'=>$id,
            ]);
        }else if($for === "savealbum"){
            $save = SavedAlbums::create([
                'user_id'=>auth()->user()->id,
                'album_id'=>$id,
            ]);
        }
        if($save){
            return "saved";
        }
    }

    function unsave($data){
        if($data->delete()){
            return "unsaved";
        }
    }

    function get_liked_albums(){
        if(auth()->user()){
            $user_id = auth()->user()->id;
            $likedAlbums = LikedAlbums::where('user_id', $user_id)->with('album.tracks')->get()->map(function($likedAlbum){
                return $likedAlbum->album;
            });
            if($likedAlbums){
                $likedAlbums = $likedAlbums->map(function($likedAlbum){
                    return $likedAlbum[0];
                });
                $likedAlbums = $likedAlbums->map(function($album)use($user_id){
                    return $this->isLiked(collect($album)->toArray(), $user_id, true);
                });
                $likedAlbums = $likedAlbums->map(function($album)use($user_id){
                    return $this->isSaved(collect($album)->toArray(), $user_id, true);
                });
            }
            return $likedAlbums;
        }
    }

    function get_liked_tracks(){
        if(auth()->user()){
            $user_id = auth()->user()->id;
            $likedTracks = LikedTracks::where('user_id', $user_id)->with('track')->get();
            if($likedTracks){
                $likedTracks = $likedTracks->map(function($likedTrack){
                    return $likedTrack->track;
                });
                $likedTracks = $likedTracks->map(function($track)use($user_id){
                    return $this->isLiked(collect($track)->toArray(), $user_id);
                });
                $likedTracks = $likedTracks->map(function($track)use($user_id){
                    return $this->isSaved(collect($track)->toArray(), $user_id);
                });
            }
            return $likedTracks;
        }
    }

    function get_saved_albums(){
        if(auth()->user()){
            $user_id = auth()->user()->id;
            $savedAlbums = SavedAlbums::where('user_id', $user_id)->with('album.tracks')->get()->map(function($savedAlbum){
                return $savedAlbum->album;
            });
            if($savedAlbums){
                $savedAlbums = $savedAlbums->map(function($savedAlbum){
                    return $savedAlbum[0];
                });
                $savedAlbums = $savedAlbums->map(function($album)use($user_id){
                    return $this->isLiked(collect($album)->toArray(), $user_id, true);
                });
                $savedAlbums = $savedAlbums->map(function($album)use($user_id){
                    return $this->isSaved(collect($album)->toArray(), $user_id, true);
                });
            }
            return $savedAlbums;
        }
    }

    function get_saved_tracks(){
        if(auth()->user()){
            $user_id = auth()->user()->id;
            $savedTracks = SavedTracks::where('user_id', $user_id)->with('track')->get();
            if($savedTracks){
                $savedTracks = $savedTracks->map(function($savedTrack){
                    return $savedTrack->track;
                });
                $savedTracks = $savedTracks->map(function($track)use($user_id){
                    return $this->isLiked(collect($track)->toArray(), $user_id);
                });
                $savedTracks = $savedTracks->map(function($track)use($user_id){
                    return $this->isSaved(collect($track)->toArray(), $user_id);
                });
            }
            return $savedTracks;
        }
    }

    function create_new_track(TrackRequest $request){
        $fileNameWithUpload = null;
        if($request->file('cover')){
            $image       = $request->file('cover');
            $fileNameWithUpload    = '/img/tracks/'.Str::slug($request->name).'-'.time().'.'.$request->cover->extension();
            $image_resize = Image::make($image->getRealPath());
            $image_resize->fit(265, 265);
            $image_resize->save(public_path($fileNameWithUpload));
        };
        if($request->file('file_name')){
            $fileNameTrack = Str::slug($request->name).time().'.'.$request->file_name->extension();
            $fileNameWithUploadTrack = '../tracks/'.$fileNameTrack;

            $request->file_name->move(public_path('tracks/'), $fileNameTrack);
        };
        $slug = Str::slug($request->singer)."-".Str::slug($request->name);
        $exist = Tracks::where('slug', $slug)->first();
        if($exist){
            $slug = Str::slug($request->singer)."-".Str::slug($request->name).'-'.mt_rand(0, 10)+mt_rand(5, 20);
        }
        $request = $request->merge([
            'file_name' => 'new song',
            'user_id'=>auth()->user()->id,
            'slug'=>$slug,
        ]);
        $newTrack = Tracks::create($request->toArray());
        return $newTrack->update(['cover'=>$fileNameWithUpload, 'file_name'=>$fileNameWithUploadTrack]);
    }

    function create_new_blog(BlogRequest $request){
        $fileNameWithUpload = null;
        if($request->file('cover')){
            $image       = $request->file('cover');
            $fileNameWithUpload    = '/img/blogs/'.Str::slug($request->title).'-'.time().'.'.$request->cover->extension();
            $image_resize = Image::make($image->getRealPath());
            $image_resize->save(public_path($fileNameWithUpload));
        };
        $slug = Str::slug($request->title);
        $exist = Blog::where('slug', $slug)->first();
        if($exist){
            $slug = Str::slug($request->title).'-'.mt_rand(0, 10)+mt_rand(5, 20);
        }
        $request = $request->merge([
            'user_id'=>auth()->user()->id,
            'slug'=>$slug,
        ]);
        $newBlog = Blog::create($request->toArray());
        return $newBlog->update(['cover'=>$fileNameWithUpload]);
    }

    function create_new_album(AlbumValidation $request){
        if(auth()->user()){
            $user_id = auth()->user()->id;
            $track_ids = explode(',',$request->track_ids);
            $tracks = Tracks::where('user_id', $user_id)->whereIn('id',$track_ids)->get();
            if(count($tracks) >= 2){
                $fileNameWithUpload = null;
                if($request->file('cover')){
                    $image       = $request->file('cover');
                    $image_big       = $request->file('cover');
                    $fileNameWithUpload    = '/img/albums/'.Str::slug($request->name).'-'.time().'.'.$request->cover->extension();
                    $fileNameWithUploadBig    = '/img/albums/'.Str::slug($request->name).'-'.time().'-big'.'.'.$request->cover->extension();
                    $image_resize_small = Image::make($image->getRealPath());
                    $image_resize_small->fit(265, 265);
                    $image_resize = Image::make($image_big->getRealPath());
                    $image_resize_small->save(public_path($fileNameWithUpload));
                    $image_resize->save(public_path($fileNameWithUploadBig));
                };
                $slug = Str::slug($request->name).'-'.Str::slug($request->artist);
                $exist = Albums::where('slug', $slug)->first();
                if($exist){
                    $slug = Str::slug($request->name).'-'.Str::slug($request->artist).'-'.mt_rand(0, 10)+mt_rand(5, 20);
                }
                $request = $request->merge([
                    'user_id'=>$user_id,
                    'slug'=>$slug,
                ]);
                $newAlbum = Albums::create($request->toArray());
                $newAlbum->update(['cover'=>$fileNameWithUpload, 'cover_big'=>$fileNameWithUploadBig]);
                Tracks::where('user_id', $user_id)->whereIn('id',$track_ids)->update(['album_id' => $newAlbum->id]);
            }
        }
    }

    function delete(Request $request){
        if(auth()->user()){
            $user_id = auth()->user()->id;
            if($request->direction === "blog"){
                $blog = Blog::where('user_id', $user_id)->where('id', $request->delete_id)->first();
                if($blog->delete()){
                    if($blog->cover){
                        if (File::exists(public_path($blog->cover))) {
                            File::delete(public_path($blog->cover));
                        }
                    }
                    return "deleted";
                }
            }else if($request->direction === "track"){
                $track = Tracks::where('user_id', $user_id)->where('id', $request->delete_id)->first();
                if($track->delete()){
                    if($track->cover !== "/img/tracks/default.jpg"){
                        if (File::exists(public_path($track->cover))) {
                            File::delete(public_path($track->cover));
                        }
                    }
                    return "deleted";
                }
            }else if($request->direction === "album"){
                $album = Albums::where('user_id', $user_id)->where('id', $request->delete_id)->first();
                if($album->delete()){
                    if($album->cover !== "/img/albums/default.jpg"){
                        if (File::exists(public_path($album->cover))) {
                            File::delete(public_path($album->cover));
                        }
                    }
                    return "deleted";
                }
            }
        }
    }

    function count_the_algorithm(Request $request){
        if($request->direction === "track"){
            $track = Tracks::select('id', 'view', 'album_id')->where('id', $request->data_id)->first();
            if($track){
                $likes = LikedTracks::where('track_id', $track->id)->get()->count();
                $count = (int)$track->view+1;
                $popularity = ((int)$likes * (int)$count) / 100;
                $track->update(["view"=>$count, "popularity"=>$popularity]);

                if($track->album_id){
                    $album = Albums::where('id', $track->album_id)->with('tracks')->first();
                    $album_likes = LikedAlbums::where('album_id', $album->id)->get()->count();
                    $all_views = $album->tracks->map(function($track){
                        return (int)$track->view;
                    })->toArray();
                    $all_views = array_sum($all_views);
                    $album_popularity = ((int)$album_likes * (int)$all_views) / 100;
                    $album->update(["popularity"=>$album_popularity]);
                }
            }
        }
    }
}
