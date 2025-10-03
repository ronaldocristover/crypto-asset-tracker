<?php

namespace App\Filament\Resources\Capitals;

use App\Filament\Resources\Capitals\Pages\ManageCapitals;
use App\Filament\Resources\Capitals\Schemas\CapitalForm;
use App\Filament\Resources\Capitals\Tables\CapitalsTable;
use App\Models\Capital;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class CapitalResource extends Resource
{
    protected static ?string $model = Capital::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBanknotes;

    public static function form(Schema $schema): Schema
    {
        return CapitalForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CapitalsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageCapitals::route('/'),
        ];
    }
}
