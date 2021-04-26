<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class HasTrackIdsMore implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $track_ids = explode(',', $value);
        if(count($track_ids) >= 20){
            return false;
        }
        return true;
    }


    public function message()
    {
        return 'Album can not contain more than 20 tracks';
    }
}
