<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use ProtoneMedia\LaravelMixins\Request\ConvertsBase64ToFiles;

class UserUpdateRequest extends FormRequest
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

    use ConvertsBase64ToFiles;

    protected function base64FileKeys(): array
    {
        return [
            'avatar' => 'avatar'.time().'.jpg',
        ];
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        //dd($this->route('id'));
        return [
            'name'=>'required|max:100|min:3',
            'about'=>'nullable|max:100',
            'phone_number'=>'nullable|regex:/^\+?[\d\(\)\-+]+$/|max:100|min:3',
            'adress'=>'nullable|max:200|min:3',
            'username'=>'required|regex:/^[a-zA-Z0-9.]+$/u|max:25|min:3|unique:users,username,'.auth()->user()->id,
            'email'=>'required|email|max:255|unique:users,email,'.auth()->user()->id,
            'avatar'=> 'image|nullable|max:2024|mimes:jpg,jpeg,png',
        ];
    }
}
