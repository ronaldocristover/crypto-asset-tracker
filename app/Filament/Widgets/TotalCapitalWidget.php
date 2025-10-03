<?php

namespace App\Filament\Widgets;

use App\Models\Capital;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class TotalCapitalWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $totalCapital = Capital::sum('amount');

        return [
            Stat::make('Total Capital', '$' . number_format($totalCapital, 2))
                ->description('Total invested capital')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('info'),
        ];
    }
}
