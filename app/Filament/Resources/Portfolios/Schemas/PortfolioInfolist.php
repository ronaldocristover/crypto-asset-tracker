<?php

namespace App\Filament\Resources\Portfolios\Schemas;

use Filament\Schemas\Schema;
use Filament\Infolists\Components\TextEntry;
use App\Filament\Resources\Portfolios\Widgets\TotalRevenueResourceOverview;

class PortfolioInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('date')
                    ->date(),
                TextEntry::make('amount')
                    ->numeric(),
                TextEntry::make('currency')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'idr' => 'success',
                        'usd' => 'info',
                    }),
                TextEntry::make('cryptoExchange.name')
                    ->label('Crypto Exchange'),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }

    protected function getHeaderWidgets(): array
    {
        return [
            TotalRevenueResourceOverview::class,
        ];
    }
}
