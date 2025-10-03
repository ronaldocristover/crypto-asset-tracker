<?php

namespace App\Filament\Widgets;

use App\Models\Capital;
use App\Models\Config;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class TotalCapitalWidget extends BaseWidget
{
    protected function getStats(): array
    {


        $usd_idr = Config::where('key', 'currency_usdidr')->first()->value;
        $totalCapital = Capital::all()
            ->sum(function ($capital) use ($usd_idr) {
                if ($capital->currency === 'idr') {
                    return $capital->amount / $usd_idr;
                }

                return $capital->amount;
            });

        return [
            Stat::make('Total Capital', '$' . number_format($totalCapital, 2))
                ->description('Total invested capital')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('info'),
        ];
    }
}
