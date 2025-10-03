<?php

namespace Database\Seeders;

use App\Models\Capital;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CapitalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $capitals = [
            ['name' => 'Initial Investment', 'amount' => 10000.00],
            ['name' => 'Additional Fund Q1', 'amount' => 5000.00],
            ['name' => 'Additional Fund Q2', 'amount' => 7500.00],
            ['name' => 'Bonus Investment', 'amount' => 3000.00],
            ['name' => 'Emergency Fund', 'amount' => 2500.00],
        ];

        foreach ($capitals as $capital) {
            Capital::create($capital);
        }
    }
}
