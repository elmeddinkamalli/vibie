<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\HasTrackIds;
use App\Rules\HasTrackIdsMore;

class AlbumValidation extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'track_ids'=>[
                'required',
                new HasTrackIds(),
                new HasTrackIdsMore()
            ],
            'artist'=>'required|max:200',
            'name'=>'required|max:200',
            'description'=>'max:400',
            'cover'=>'image|max:10024|mimes:jpg,jpeg,png',
        ];
    }

    public function messages()
    {         
        $messages = [ 
            'track_ids.required' => 'Album must contain at least 2 tracks',
            'artist.required' => 'Please, input the artist name',
        ];

        return $messages;
    }  
}
