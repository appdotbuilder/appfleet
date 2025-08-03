<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Server>
 */
class ServerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(2, true) . ' Server',
            'hostname' => fake()->domainName(),
            'ip_address' => fake()->ipv4(),
            'port' => 22,
            'status' => fake()->randomElement(['active', 'inactive', 'maintenance']),
            'specs' => [
                'cpu' => fake()->randomElement(['4 vCPU', '8 vCPU', '16 vCPU']),
                'ram' => fake()->randomElement(['8GB', '16GB', '32GB', '64GB']),
                'disk' => fake()->randomElement(['100GB SSD', '500GB SSD', '1TB SSD']),
            ],
            'location' => fake()->randomElement(['US East', 'US West', 'Europe', 'Asia']),
        ];
    }

    /**
     * Indicate that the server is active.
     */
    public function active(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }
}