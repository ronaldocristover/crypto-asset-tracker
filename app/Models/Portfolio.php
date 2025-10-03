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
}
