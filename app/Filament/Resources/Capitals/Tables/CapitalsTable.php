<?php

namespace App\Filament\Resources\Capitals\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class CapitalsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('amount')
                    ->numeric()
                    ->formatStateUsing(function ($state, $record) {
                        $currency = strtolower($record->currency);
                        $symbol = match ($currency) {
                            'usd' => '$',
                            'eur' => '€',
                            'gbp' => '£',
                            'jpy' => '¥',
                            'aud' => 'A$',
                            'cad' => 'C$',
                            'chf' => 'CHF',
                            'cny' => '¥',
                            'idr' => 'Rp.',
                            default => strtoupper($currency),
                        };

                        $decimals = in_array($currency, ['idr', 'jpy']) ? 0 : 2;
                        $formattedAmount = number_format($state, $decimals);

                        return $symbol . ' ' . $formattedAmount;
                    })
                    ->sortable(),
                TextColumn::make('currency')
                    ->badge()
                    ->color(fn (string $state): string => match (strtolower($state)) {
                        'idr' => 'success',
                        'usd' => 'info',
                        'eur' => 'primary',
                        'gbp' => 'warning',
                        'jpy' => 'danger',
                        'aud' => 'gray',
                        'cad' => 'success',
                        'chf' => 'info',
                        'cny' => 'primary',
                        default => 'gray',
                    })
                    ->searchable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                CreateAction::make(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}