<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Capital extends Model
{
    protected $fillable = [
        'name',
        'amount',
        'currency',
    ];

    public static function getTotalCapitalUsd()
    {
        $rates = Config::getUsdIdr();

        return self::all()
            ->sum(function ($capital) use ($rates) {
                if ($capital->currency === 'idr') {
                    return $capital->amount / $rates;
                }

                return $capital->amount;
            });
    }
}
