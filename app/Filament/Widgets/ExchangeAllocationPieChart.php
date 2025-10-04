<?php

namespace App\Filament\Widgets;

use App\Models\Portfolio;
use App\Models\Config;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class ExchangeAllocationPieChart extends ChartWidget
{
    protected ?string $heading = 'Exchange Allocation (Today)';

    protected int | string | array $columnSpan = 1;

    protected static ?int $sort = 1;

    protected ?string $maxHeight = '300px';

    protected function getData(): array
    {
        $today = now()->toDateString();
        $rates = Config::getUsdIdr();

        // Get allocation per exchange for today with currency conversion
        $allocations = Portfolio::whereDate('date', $today)
            ->join('crypto_exchanges', 'portfolios.cex_id', '=', 'crypto_exchanges.id')
            ->select(
                'crypto_exchanges.name',
                DB::raw("SUM(
                CASE
                    WHEN portfolios.currency = 'idr' THEN portfolios.amount / {$rates}
                    ELSE portfolios.amount
                END
            ) as total_amount_usd")
            )
            ->groupBy('crypto_exchanges.id', 'crypto_exchanges.name')
            ->orderByDesc('total_amount_usd')
            ->get();

        $labels = [];
        $data = [];
        $colors = [
            'rgb(245, 158, 11)',  // Amber
            'rgb(59, 130, 246)',  // Blue
            'rgb(16, 185, 129)',  // Green
            'rgb(239, 68, 68)',   // Red
            'rgb(139, 92, 246)',  // Purple
            'rgb(236, 72, 153)',  // Pink
            'rgb(251, 146, 60)',  // Orange
        ];

        foreach ($allocations as $allocation) {
            $labels[] = $allocation->name;
            $data[] = round((float) $allocation->total_amount_usd, 2);
        }

        return [
            'datasets' => [
                [
                    'label' => 'Allocation (USD)',
                    'data' => $data,
                    'backgroundColor' => array_slice($colors, 0, count($data)),
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'pie';
    }
}
