<?php

namespace App\Filament\Widgets;

use App\Models\Capital;
use App\Models\Portfolio;

use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class CalculationOverview extends StatsOverviewWidget
{

    public function getTotalCapital()
    {
        return Capital::getTotalCapitalUsd();
    }

    public function getPortfolio()
    {
        $todayTotal = Portfolio::getTodayAmountInUsd();
        $yesterdayTotal = Portfolio::getYesterdayAmountInUsd();

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
            'todayTotal' => $todayTotal,
            'percentageChangeFormatted' => $percentageChangeFormatted,
            'trend' => $trend,
            'color' => $color

        ];
    }

    protected function getTotalPnl(): array
    {

        // Get total portfolio amount for today
        $todayTotal = Portfolio::getTodayAmountInUsd();

        // Get total capital
        $totalCapital = Capital::getTotalCapitalUsd();

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
            'color' => $color,
            'trend' => $trend,
            'revenue' => $revenue,
            'percentageFormatted' => $percentageFormatted
        ];
    }

    protected function getStats(): array
    {
        $portfolio = $this->getPortfolio();
        $pnl = $this->getTotalPnl();
        $totalCapital = $this->getTotalCapital();

        return [
            Stat::make('Total Modal', '$' . number_format($totalCapital, 2))
                ->description('Total invested capital')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('info'),

            Stat::make('Total Portfolio Today', '$' . number_format($portfolio['todayTotal'], 2))
                ->description($portfolio['percentageChangeFormatted'] . ' from yesterday')
                ->descriptionIcon('heroicon-m-arrow-trending-' . $portfolio['trend'])
                ->color($portfolio['color']),

            Stat::make('Total Profit/Loss', '$' . number_format($pnl['revenue'], 2))
                ->description($pnl['percentageFormatted'] . " return on capital")
                ->descriptionIcon('heroicon-m-arrow-trending-' . $pnl['trend'])
                ->color($pnl['color']),
        ];
    }
}
