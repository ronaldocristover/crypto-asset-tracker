<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Portfolio extends Model
{
    protected $fillable = [
        'date',
        'amount',
        'currency',
        'cex_id',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function cryptoExchange(): BelongsTo
    {
        return $this->belongsTo(CryptoExchange::class, 'cex_id');
    }

    public static function getTodayAmountInUsd()
    {
        return self::getAmountInUsd(now()->toDateString());
    }

    public static  function getYesterdayAmountInUsd()
    {
        $yesterday = now()->subDay()->toDateString();
        return self::getAmountInUsd($yesterday);
    }

    public static function getAmountInUsd($date = null)
    {
        $rates = Config::getUsdIdr();

        $query = self::query();

        if ($date) {
            $query->whereDate('date', $date);
        }

        return $query->get()
            ->sum(function ($portfolio) use ($rates) {
                if ($portfolio->currency === 'idr') {
                    return $portfolio->amount / $rates;
                }

                return $portfolio->amount;
            });
    }
}
