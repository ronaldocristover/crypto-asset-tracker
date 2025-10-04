<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Config extends Model
{
    protected $fillable = [
        'key',
        'value',
    ];

    public static function getValue(string $key, $default = null, int $ttl = 3600)
    {
        return Cache::remember("config.{$key}", $ttl, function () use ($key, $default) {
            $config = self::where('key', $key)->first();
            return $config ? $config->value : $default;
        });
    }

    public static function getUsdIdr()
    {
        return (float) self::getValue('usd_idr', 16500);
    }

    public static function clearCache(?string $key = null)
    {
        if ($key) {
            Cache::forget("config.{$key}");
        } else {
            // Clear all config cache
            $keys = self::pluck('key');
            foreach ($keys as $k) {
                Cache::forget("config.{$k}");
            }
        }
    }
}
