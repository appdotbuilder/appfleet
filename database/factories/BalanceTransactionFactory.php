<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BalanceTransaction>
 */
class BalanceTransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(['credit', 'debit']);
        
        return [
            'user_id' => User::factory(),
            'type' => $type,
            'amount' => fake()->randomFloat(2, 1, 50),
            'description' => $type === 'credit' 
                ? fake()->randomElement(['Account top-up', 'Refund', 'Bonus credit'])
                : fake()->randomElement(['Service deployment', 'Database usage', 'Domain registration']),
            'reference' => fake()->optional()->uuid(),
        ];
    }

    /**
     * Indicate that the transaction is a credit.
     */
    public function credit(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'credit',
            'description' => fake()->randomElement(['Account top-up', 'Refund', 'Bonus credit']),
        ]);
    }

    /**
     * Indicate that the transaction is a debit.
     */
    public function debit(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'debit',
            'description' => fake()->randomElement(['Service deployment', 'Database usage', 'Domain registration']),
        ]);
    }
}