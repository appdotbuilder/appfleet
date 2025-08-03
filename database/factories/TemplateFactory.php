<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Template>
 */
class TemplateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->randomElement([
            'Node.js',
            'Python Flask',
            'Laravel',
            'React App',
            'WordPress',
            'Next.js',
            'PostgreSQL',
            'MySQL',
            'Redis',
            'MongoDB',
        ]);

        $type = in_array($name, ['PostgreSQL', 'MySQL', 'Redis', 'MongoDB']) ? 'database' : 'service';

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->sentence(10),
            'docker_image' => $type === 'database' 
                ? strtolower($name) . ':latest'
                : 'node:18-alpine',
            'type' => $type,
            'environment_variables' => $type === 'database' 
                ? ['DB_PASSWORD' => 'password', 'DB_USER' => 'admin']
                : ['NODE_ENV' => 'production', 'PORT' => '3000'],
            'exposed_ports' => $type === 'database'
                ? [match($name) {
                    'PostgreSQL' => 5432,
                    'MySQL' => 3306,
                    'Redis' => 6379,
                    'MongoDB' => 27017,
                    default => 3000
                }]
                : [3000, 8080],
            'icon' => '🚀',
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the template is a service.
     */
    public function service(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'service',
        ]);
    }

    /**
     * Indicate that the template is a database.
     */
    public function database(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'database',
        ]);
    }
}