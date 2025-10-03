<?php

namespace App\Filament\Resources\CryptoExchanges\Pages;

use App\Filament\Resources\CryptoExchanges\CryptoExchangeResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageCryptoExchanges extends ManageRecords
{
    protected static string $resource = CryptoExchangeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
