<?php

namespace App\Filament\Widgets;

use App\Models\Capital;
use App\Models\Config;
use App\Models\Portfolio;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class TotalRevenueWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $today = now()->toDateString();
        $usdidr = Config::where('key', 'currency_usdidr')->first()->value;

        // Get total portfolio amount for today
        $todayTotal = Portfolio::whereDate('date', $today)
            ->get()
            ->sum(function ($portfolio) use ($usdidr) {
                if ($portfolio->currency === 'idr') {
                    return $portfolio->amount / $usdidr;
                }

                return $portfolio->amount;
            });
        // Get total capital
        $totalCapital = Capital::all()
            ->sum(function ($capital) use ($usdidr) {
                if ($capital->currency === 'idr') {
                    return $capital->amount / $usdidr;
                }

                return $capital->amount;
            });

        // Calculate revenue (profit/loss)
        $revenue = $todayTotal - $totalCapital;

        // Calculate percentage
        $percentage = 0;
        if ($totalCapital > 0) {
            $percentage = ($revenue / $totalCapital) * 100;
        }

        // Format the percentage with + or - sign
        $percentageFormatted = sprintf(
            '%s%.2f%%',
            $percentage >= 0 ? '+' : '',
            $percentage
        );

        // Determine color based on revenue
        $color = $revenue >= 0 ? 'success' : 'danger';
        $trend = $revenue >= 0 ? 'up' : 'down';

        return [
            Stat::make('Total Revenue', number_format($revenue, 2))
                ->description($percentageFormatted . " return on capital")
                ->descriptionIcon("heroicon-m-arrow-trending-" . $trend)
                ->color($color),
        ];
    }
}
