<?php

namespace App\Http\Controllers;

use App\Http\Requests\TopUpBalanceRequest;
use App\Models\BalanceTransaction;
use App\Models\UserBalance;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BalanceController extends Controller
{
    /**
     * Display the user's balance and transactions.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $balance = $user->balance->balance ?? 0;
        
        $transactions = $user->balanceTransactions()
            ->latest()
            ->paginate(20);

        return Inertia::render('balance/index', [
            'balance' => $balance,
            'transactions' => $transactions,
        ]);
    }

    /**
     * Show the top-up form.
     */
    public function create()
    {
        return Inertia::render('balance/top-up');
    }

    /**
     * Process a balance top-up.
     */
    public function store(TopUpBalanceRequest $request)
    {
        $user = $request->user();
        $amount = $request->amount;

        // Create or get user balance
        $userBalance = UserBalance::firstOrCreate(
            ['user_id' => $user->id],
            ['balance' => 0]
        );

        // Add to balance
        $userBalance->increment('balance', $amount);

        // Record transaction
        BalanceTransaction::create([
            'user_id' => $user->id,
            'type' => 'credit',
            'amount' => $amount,
            'description' => 'Account top-up',
            'reference' => 'topup_' . uniqid(),
        ]);

        return redirect()->route('balance.index')
            ->with('success', "Successfully added \${$amount} to your account!");
    }
}