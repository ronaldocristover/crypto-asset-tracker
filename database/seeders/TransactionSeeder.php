<?php

namespace Database\Seeders;

use App\Models\Capital;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY'];

        for ($i = 0; $i < 7 * 12; $i++) { // 7 years, 12 months
            $date = Carbon::now()->subMonths($i);

            $transactionsCount = rand(1, 5);

            for ($j = 0; $j < $transactionsCount; $j++) {
                Capital::create([
                    'name' => 'Transaction on ' . $date->format('Y-m-d'),
                    'amount' => rand(100, 100000) / 100,
                    'currency' => $currencies[array_rand($currencies)],
                    'created_at' => $date,
                    'updated_at' => $date,
                ]);
            }
        }
    }
}