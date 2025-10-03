<?php

namespace App\Filament\Resources\Capitals\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class CapitalForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                TextInput::make('amount')
                    ->required()
                    ->numeric()
                    ->step(0.01),
                Select::make('currency')
                    ->required()
                    ->options([
                        'usd' => 'USD',
                        'idr' => 'IDR',
                    ])
                    ->default('usd'),
            ]);
    }
}
