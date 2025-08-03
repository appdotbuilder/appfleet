<?php

namespace Database\Factories;

use App\Models\Plan;
use App\Models\Server;
use App\Models\Template;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Deployment>
 */
class DeploymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = fake()->randomElement(['pending', 'running', 'stopped', 'failed', 'suspended']);
        
        return [
            'user_id' => User::factory(),
            'template_id' => Template::factory(),
            'plan_id' => Plan::factory(),
            'server_id' => Server::factory(),
            'name' => fake()->domainWord() . '-' . fake()->randomNumber(4),
            'container_id' => $status !== 'pending' ? fake()->sha256() : null,
            'status' => $status,
            'environment_variables' => [
                'APP_ENV' => 'production',
                'DATABASE_URL' => fake()->url(),
            ],
            'port_mappings' => [
                '3000' => fake()->numberBetween(30000, 65535),
            ],
            'custom_domain' => fake()->optional(0.3)->domainName(),
            'connection_info' => $status === 'running' ? 'https://' . fake()->domainName() : null,
            'deployed_at' => $status !== 'pending' ? fake()->dateTimeBetween('-1 month') : null,
            'last_accessed_at' => $status === 'running' ? fake()->dateTimeBetween('-1 week') : null,
        ];
    }

    /**
     * Indicate that the deployment is running.
     */
    public function running(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'running',
            'container_id' => fake()->sha256(),
            'deployed_at' => fake()->dateTimeBetween('-1 month'),
            'last_accessed_at' => fake()->dateTimeBetween('-1 week'),
        ]);
    }
}