<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDeploymentRequest;
use App\Models\Deployment;
use App\Models\Plan;
use App\Models\Server;
use App\Models\Template;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeploymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $deployments = $request->user()
            ->deployments()
            ->with(['template', 'plan', 'server'])
            ->latest()
            ->paginate(10);

        return Inertia::render('deployments/index', [
            'deployments' => $deployments,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $templates = Template::active()->get();
        $plans = Plan::active()->get();

        return Inertia::render('deployments/create', [
            'templates' => $templates,
            'plans' => $plans,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDeploymentRequest $request)
    {
        $user = $request->user();
        $template = Template::findOrFail($request->template_id);
        $plan = Plan::findOrFail($request->plan_id);

        // Check if user has sufficient balance (simplified check)
        $userBalance = $user->balance->balance ?? 0;
        $minimumBalance = $plan->price_per_hour * 24; // Require at least 24 hours of balance

        if ($userBalance < $minimumBalance) {
            return back()->withErrors([
                'balance' => 'Insufficient balance. Please top up your account.',
            ]);
        }

        // Get an available server (simplified - just pick the first active one)
        $server = Server::active()->first();

        if (!$server) {
            return back()->withErrors([
                'server' => 'No servers available. Please try again later.',
            ]);
        }

        $deployment = Deployment::create([
            'user_id' => $user->id,
            'template_id' => $template->id,
            'plan_id' => $plan->id,
            'server_id' => $server->id,
            'name' => $request->name,
            'status' => 'pending',
            'custom_domain' => $request->custom_domain,
            'environment_variables' => $request->environment_variables ?? $template->environment_variables,
            'port_mappings' => [
                ($template->exposed_ports[0] ?? 3000) => random_int(30000, 65535)
            ],
        ]);

        return redirect()->route('deployments.show', $deployment)
            ->with('success', 'Deployment created successfully! It will be ready in a few minutes.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Deployment $deployment)
    {
        // Ensure user can only see their own deployments
        if ($deployment->user_id !== auth()->id()) {
            abort(403);
        }

        $deployment->load(['template', 'plan', 'server']);

        return Inertia::render('deployments/show', [
            'deployment' => $deployment,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Deployment $deployment)
    {
        // Ensure user can only edit their own deployments
        if ($deployment->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('deployments/edit', [
            'deployment' => $deployment,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Deployment $deployment)
    {
        // Ensure user can only update their own deployments  
        if ($deployment->user_id !== auth()->id()) {
            abort(403);
        }

        // Handle action requests
        if ($request->has('action')) {
            return $this->handleAction($request, $deployment);
        }

        // Handle regular updates
        $request->validate([
            'custom_domain' => 'nullable|string|max:255|regex:/^[a-zA-Z0-9.-]+$/',
            'environment_variables' => 'nullable|array',
        ]);

        $deployment->update([
            'custom_domain' => $request->custom_domain,
            'environment_variables' => $request->environment_variables,
        ]);

        return redirect()->route('deployments.show', $deployment)
            ->with('success', 'Deployment updated successfully.');
    }

    /**
     * Handle deployment actions.
     */
    protected function handleAction(Request $request, Deployment $deployment)
    {
        $action = $request->input('action');

        switch ($action) {
            case 'start':
                if ($deployment->status === 'stopped') {
                    $deployment->update([
                        'status' => 'running',
                        'deployed_at' => now(),
                    ]);
                    return back()->with('success', 'Deployment started successfully.');
                }
                break;

            case 'stop':
                if ($deployment->status === 'running') {
                    $deployment->update(['status' => 'stopped']);
                    return back()->with('success', 'Deployment stopped successfully.');
                }
                break;

            case 'restart':
                if (in_array($deployment->status, ['running', 'stopped'])) {
                    $deployment->update([
                        'status' => 'running',
                        'deployed_at' => now(),
                    ]);
                    return back()->with('success', 'Deployment restarted successfully.');
                }
                break;

            case 'suspend':
                if ($deployment->status === 'running') {
                    $deployment->update(['status' => 'suspended']);
                    return back()->with('success', 'Deployment suspended successfully.');
                }
                break;
        }

        return back()->withErrors(['status' => 'Action cannot be performed in current state.']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Deployment $deployment)
    {
        // Ensure user can only delete their own deployments
        if ($deployment->user_id !== auth()->id()) {
            abort(403);
        }

        $deployment->delete();

        return redirect()->route('deployments.index')
            ->with('success', 'Deployment deleted successfully.');
    }
}