<?php

namespace App\Filament\Resources\Capitals\Pages;

use App\Filament\Resources\Capitals\CapitalResource;
use Filament\Resources\Pages\ManageRecords;

class ManageCapitals extends ManageRecords
{
    protected static string $resource = CapitalResource::class;

    protected static ?string $title = 'Capitals';
}
