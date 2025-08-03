<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Plan>
 */
class PlanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $plans = [
            [
                'name' => 'Starter',
                'price_per_hour' => 0.0100,
                'cpu_cores' => 1,
                'memory_mb' => 512,
                'disk_gb' => 10,
                'bandwidth_gb' => 100,
            ],
            [
                'name' => 'Basic',
                'price_per_hour' => 0.0250,
                'cpu_cores' => 1,
                'memory_mb' => 1024,
                'disk_gb' => 25,
                'bandwidth_gb' => 250,
            ],
            [
                'name' => 'Standard',
                'price_per_hour' => 0.0500,
                'cpu_cores' => 2,
                'memory_mb' => 2048,
                'disk_gb' => 50,
                'bandwidth_gb' => 500,
            ],
            [
                'name' => 'Pro',
                'price_per_hour' => 0.1000,
                'cpu_cores' => 4,
                'memory_mb' => 4096,
                'disk_gb' => 100,
                'bandwidth_gb' => 1000,
            ],
        ];

        $plan = fake()->randomElement($plans);

        return [
            'name' => $plan['name'],
            'slug' => Str::slug($plan['name']),
            'description' => "Perfect for small to medium applications with {$plan['cpu_cores']} CPU cores and " . 
                           ($plan['memory_mb'] >= 1024 ? ($plan['memory_mb'] / 1024) . 'GB' : $plan['memory_mb'] . 'MB') . 
                           " RAM",
            'price_per_hour' => $plan['price_per_hour'],
            'cpu_cores' => $plan['cpu_cores'],
            'memory_mb' => $plan['memory_mb'],
            'disk_gb' => $plan['disk_gb'],
            'bandwidth_gb' => $plan['bandwidth_gb'],
            'is_active' => true,
        ];
    }
}