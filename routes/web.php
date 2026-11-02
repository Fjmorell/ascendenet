<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\LegalController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::post('leads', [LeadController::class, 'store'])
    ->middleware('throttle:leads')
    ->name('leads.store');

Route::get('{page}', LegalController::class)
    ->whereIn('page', ['aviso-legal', 'privacidad', 'cookies'])
    ->name('legal');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', Admin\DashboardController::class)->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('leads', [Admin\LeadController::class, 'index'])->name('leads.index');
        Route::patch('leads/{lead}', [Admin\LeadController::class, 'update'])->name('leads.update');
        Route::delete('leads/{lead}', [Admin\LeadController::class, 'destroy'])->name('leads.destroy');

        Route::get('catalogo', [Admin\CatalogController::class, 'index'])->name('catalog.index');
        Route::patch('services/{service}', [Admin\CatalogController::class, 'updateService'])->name('services.update');
        Route::post('tariffs', [Admin\CatalogController::class, 'storeTariff'])->name('tariffs.store');
        Route::patch('tariffs/{tariff}', [Admin\CatalogController::class, 'updateTariff'])->name('tariffs.update');
        Route::delete('tariffs/{tariff}', [Admin\CatalogController::class, 'destroyTariff'])->name('tariffs.destroy');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
