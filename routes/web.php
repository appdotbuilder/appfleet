<?php

use App\Http\Controllers\BalanceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DeploymentController;
use App\Models\Plan;
use App\Models\Template;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    $templates = Template::active()->take(6)->get();
    $plans = Plan::active()->take(4)->get();
    
    return Inertia::render('welcome', [
        'templates' => $templates,
        'plans' => $plans,
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Deployment routes
    Route::resource('deployments', DeploymentController::class);
    
    // Deployment actions (using update method with action parameter)
    Route::patch('deployments/{deployment}/start', [DeploymentController::class, 'update'])
        ->name('deployments.start');
    Route::patch('deployments/{deployment}/stop', [DeploymentController::class, 'update']) 
        ->name('deployments.stop');
    Route::patch('deployments/{deployment}/restart', [DeploymentController::class, 'update'])
        ->name('deployments.restart');
    Route::patch('deployments/{deployment}/suspend', [DeploymentController::class, 'update'])
        ->name('deployments.suspend');
    
    // Balance routes
    Route::get('balance', [BalanceController::class, 'index'])->name('balance.index');
    Route::get('balance/top-up', [BalanceController::class, 'create'])->name('balance.create');
    Route::post('balance/top-up', [BalanceController::class, 'store'])->name('balance.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
