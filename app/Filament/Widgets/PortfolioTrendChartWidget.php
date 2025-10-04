<?php

namespace App\Filament\Widgets;

use App\Models\Portfolio;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class PortfolioTrendChartWidget extends ChartWidget
{
    protected ?string $heading = 'Portfolio Trend (Last 7 Days)';

    protected int | string | array $columnSpan = 1; // Ambil 1 kolom dari 2

    protected static ?int $sort = 2; // Tampil kedua (kanan)

    protected ?string $maxHeight = '300px';

    protected function getData(): array
    {
        $endDate = now()->addDay();
        $startDate = now()->subDays(6);

        // Get total amount grouped by date for the last 7 days
        $data = Portfolio::whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()])
            ->selectRaw('DATE(date) as chart_date, SUM(amount) as total_amount')
            ->groupBy('chart_date')
            ->orderBy('chart_date')
            ->pluck('total_amount', 'chart_date');
        // Create array of all 7 days
        $labels = [];
        $amounts = [];

        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->toDateString();
            $labels[] = now()->subDays($i)->format('M d');
            $amounts[] = (float) ($data[$date] ?? 0);
        }
        return [
            'datasets' => [
                [
                    'label' => 'Total Portfolio Amount',
                    'data' => $amounts,
                    'borderColor' => 'rgb(245, 158, 11)',
                    'backgroundColor' => 'rgba(245, 158, 11, 0.1)',
                    'fill' => true,
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
