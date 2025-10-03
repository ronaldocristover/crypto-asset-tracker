<?php

namespace App\Filament\Resources\Portfolios\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class PortfolioForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                DatePicker::make('date')
                    ->required()
                    ->default(now()),
                TextInput::make('amount')
                    ->required()
                    ->numeric()
                    ->integer()
                    ->default(0),
                Select::make('currency')
                    ->required()
                    ->options([
                        'idr' => 'IDR',
                        'usd' => 'USD',
                    ])
                    ->default('idr'),
                Select::make('cex_id')
                    ->required()
                    ->relationship('cryptoExchange', 'name')
                    ->searchable()
                    ->preload()
                    ->default(function () {
                        return \App\Models\CryptoExchange::first()?->id;
                    }),
            ]);
    }
}
