<?php

namespace App\Http\Controllers;

use App\Models\Deployment;
use App\Models\Plan;
use App\Models\Template;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get user's deployments with relationships
        $deployments = $user->deployments()
            ->with(['template', 'plan', 'server'])
            ->latest()
            ->take(5)
            ->get();

        // Get user's balance
        $balance = $user->balance->balance ?? 0;

        // Get recent balance transactions
        $recentTransactions = $user->balanceTransactions()
            ->latest()
            ->take(5)
            ->get();

        // Get deployment stats
        $deploymentStats = [
            'total' => $user->deployments()->count(),
            'running' => $user->deployments()->where('status', 'running')->count(),
            'stopped' => $user->deployments()->where('status', 'stopped')->count(),
            'pending' => $user->deployments()->where('status', 'pending')->count(),
        ];

        return Inertia::render('dashboard', [
            'deployments' => $deployments,
            'balance' => $balance,
            'recentTransactions' => $recentTransactions,
            'deploymentStats' => $deploymentStats,
        ]);
    }
}