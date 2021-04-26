<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\UserUpdateRequest;
use Intervention\Image\ImageManagerStatic as Image;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Session;
use App\Models\Follows;

class AuthController extends Controller
{
    public function login(Request $request){
        $cred = $request->only(['username', 'password']);
        $this->validate($request, [
            'username'=>'required',
            'password'=>'required',
        ]);
        if(!Auth::attempt($cred)){
            return response(['error' => 'Invalid login deatils'], Response::HTTP_UNAUTHORIZED);
        }
        $user = Auth::user();
        $token = $user->createToken('token')->plainTextToken;
        $cookie = cookie('jwt', $token, 60 * 24);
        return response([
            'message' => "Success",
        ])->withCookie($cookie);
    }

    public function isauth(){
        $user = Auth::user();
        if($user){
            return $user;
        }else{
            return abort(401);
        }
    }

    public function logout(){
        $cookie = Cookie::forget('jwt');
        Session::flush();
        Session::forget('key');

        return response([
            'message'=>'Success'
        ])->withCookie($cookie);
    }

    public function register(Request $request){
        $this->validate($request, [
            'name'=>'required|max:100|min:3',
            'username'=>'required|regex:/^[a-zA-Z0-9.]+$/u|unique:users|max:25|min:3',
            'email'=>'required|unique:users|email|max:255',
            'password'=>'required|confirmed',
        ]);

        User::create([
            'name'=>$request->name,
            'username'=>$request->username,
            'email'=>$request->email,
            'password'=>Hash::make($request->password),
        ]);
        
        return $this->login($request);
    }

    function update_user(UserUpdateRequest $request){
        if(auth()->user()){
            $id = auth()->user()->id;
            $user = User::where('id', $id)->first() ?? abort(404);
            if($request->file('avatar')){
                $image = $request->file('avatar');
                $fileNameWithUpload = '/img/users/'.$request->username.'-'.time().'.'.$request->avatar->extension();
                $image_resize = Image::make($image->getRealPath());
                $image_resize->fit(200, 200);
                $image_resize->save(public_path($fileNameWithUpload));
            };
            $user->update($request->except(['avatar']));
            if($request->file('avatar')){
                $user->update(['avatar'=>$fileNameWithUpload]);
            }
            return "updated";
        }
    }

    function follow_unfollow(Request $request){
        if(auth()->user()){
            $my_id = auth()->user()->id;
            $follow = Follows::where('following', $request->user_id)->where('follower', $my_id)->first();
            if($follow){
                $follow->delete();
                return "unfollowed";
            }else{
                Follows::create(['following'=>$request->user_id, 'follower'=>$my_id]);
                return "followed";
            }
        }
    }

    function get_user_followings($id){
        $user_ids = Follows::select('following')->where('follower',$id)->orderBy('created_at', 'DESC')->get();
        if(count($user_ids)>1){
            $strinfyed = $user_ids->map(function($id){
                return $id->following;
            })->toArray();
            return $followings = User::select('username', 'avatar', 'id')->whereIn('id',$user_ids)->orderByRaw('FIELD(id, '.implode(",",$strinfyed).')')->get();
        }
        return $followings = User::select('username', 'avatar', 'id')->whereIn('id',$user_ids)->get();
    }

    function get_user_followers($id){
        $user_ids = Follows::select('follower')->where('following',$id)->orderBy('created_at', 'DESC')->get();
        if(count($user_ids)>1){
            $strinfyed = $user_ids->map(function($id){
                return $id->following;
            })->toArray();
            return $followings = User::select('username', 'avatar', 'id')->whereIn('id',$user_ids)->orderByRaw('FIELD(id, '.implode(",",$strinfyed).')')->get();
        }
        return $followings = User::select('username', 'avatar', 'id')->whereIn('id',$user_ids)->get();
    }
}
