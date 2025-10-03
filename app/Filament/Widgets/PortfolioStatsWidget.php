<?php

namespace App\Filament\Widgets;

use App\Models\Portfolio;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\DB;

class PortfolioStatsWidget extends BaseWidget
{
    protected int | string | array $columnSpan = 'full';

    protected function getStats(): array
    {
        $today = now()->toDateString();
        $yesterday = now()->subDay()->toDateString();

        // Get total portfolio amount for today
        $todayTotal = Portfolio::whereDate('date', $today)
            ->sum('amount');

        // Get total portfolio amount for yesterday
        $yesterdayTotal = Portfolio::whereDate('date', $yesterday)
            ->sum('amount');

        // Calculate percentage change
        $percentageChange = 0;
        if ($yesterdayTotal > 0) {
            $percentageChange = (($todayTotal - $yesterdayTotal) / $yesterdayTotal) * 100;
        }

        // Format the percentage change with + or - sign
        $percentageChangeFormatted = sprintf(
            '%s%.2f%%',
            $percentageChange >= 0 ? '+' : '',
            $percentageChange
        );

        // Determine trend icon and color
        $trend = $percentageChange >= 0 ? 'up' : 'down';
        $color = $percentageChange >= 0 ? 'success' : 'danger';

        return [
            Stat::make('Total Portfolio Today', '$' . number_format($todayTotal, 2))
                ->description($percentageChangeFormatted . ' from yesterday')
                ->descriptionIcon('heroicon-m-arrow-trending-' . $trend)
                ->color($color),
        ];
    }
}
