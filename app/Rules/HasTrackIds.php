<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class HasTrackIds implements Rule
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
        if(count($track_ids) >= 2){
            return true;
        }
        return false;
    }


    public function message()
    {
        return 'Album must contain at least 2 tracks';
    }
}
