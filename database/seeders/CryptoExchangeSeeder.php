<?php

namespace Database\Seeders;

use App\Models\CryptoExchange;
use Illuminate\Database\Seeder;

class CryptoExchangeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $exchanges = [
            ['name' => 'Binance'],
            ['name' => 'Bitget'],
            ['name' => 'Tokocrypto'],
            ['name' => 'Pluang'],
            ['name' => 'Indodax'],
            ['name' => 'Rekeningku'],
            ['name' => 'Pintu'],
        ];

        foreach ($exchanges as $exchange) {
            CryptoExchange::create($exchange);
        }
    }
}
