<?php

namespace App\Filament\Resources\Portfolios;

use BackedEnum;
use App\Models\Portfolio;
use Filament\Tables\Table;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Support\Icons\Heroicon;
use App\Filament\Resources\Portfolios\Schemas\PortfolioForm;
use App\Filament\Resources\Portfolios\Pages\ManagePortfolios;
use App\Filament\Resources\Portfolios\Tables\PortfoliosTable;
use App\Filament\Resources\Portfolios\Schemas\PortfolioInfolist;
use App\Filament\Resources\Portfolios\Widgets\TotalRevenueResourceOverview;

class PortfolioResource extends Resource
{
    protected static ?string $model = Portfolio::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return PortfolioForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return PortfolioInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PortfoliosTable::configure($table);
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
            'index' => ManagePortfolios::route('/'),
        ];
    }

    public static function getWidgets(): array
    {
        return [
            TotalRevenueResourceOverview::class,
        ];
    }
}
