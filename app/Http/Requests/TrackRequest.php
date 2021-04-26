<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TrackRequest extends FormRequest
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
            'name'=>'required|max:120',
            'singer'=>'required|max:80',
            'description'=>'max:300',
            'cover'=>'image|max:10024|mimes:jpg,jpeg,png',
            'file_name'=>'required|mimes:application/octet-stream,audio/mpeg,mpga,mp3,wav',
        ];
    }

    public function messages()
    {         
        $messages = [ 
            'file_name.mimes' => 'The audio file must be a file of type mpeg, mpga, mp3, wav.'
        ];

        return $messages;
    }  
}
