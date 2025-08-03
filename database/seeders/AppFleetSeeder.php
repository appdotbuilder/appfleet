<?php

namespace Database\Seeders;

use App\Models\BalanceTransaction;
use App\Models\Deployment;
use App\Models\Plan;
use App\Models\Server;
use App\Models\Template;
use App\Models\User;
use App\Models\UserBalance;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AppFleetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create servers
        Server::factory()->create([
            'name' => 'US-East-1',
            'hostname' => 'us-east-1.appfleet.com',
            'ip_address' => '192.168.1.10',
            'status' => 'active',
            'location' => 'US East',
            'specs' => [
                'cpu' => '16 vCPU',
                'ram' => '64GB',
                'disk' => '1TB SSD',
            ],
        ]);

        Server::factory()->create([
            'name' => 'Europe-West-1',
            'hostname' => 'eu-west-1.appfleet.com',
            'ip_address' => '192.168.2.10',
            'status' => 'active',
            'location' => 'Europe',
            'specs' => [
                'cpu' => '8 vCPU',
                'ram' => '32GB',
                'disk' => '500GB SSD',
            ],
        ]);

        // Create plans
        Plan::factory()->create([
            'name' => 'Starter',
            'slug' => 'starter',
            'description' => 'Perfect for small applications and testing',
            'price_per_hour' => 0.0100,
            'cpu_cores' => 1,
            'memory_mb' => 512,
            'disk_gb' => 10,
            'bandwidth_gb' => 100,
        ]);

        Plan::factory()->create([
            'name' => 'Basic',
            'slug' => 'basic',
            'description' => 'Ideal for small production workloads',
            'price_per_hour' => 0.0250,
            'cpu_cores' => 1,
            'memory_mb' => 1024,
            'disk_gb' => 25,
            'bandwidth_gb' => 250,
        ]);

        Plan::factory()->create([
            'name' => 'Standard',
            'slug' => 'standard',
            'description' => 'Great for medium applications with moderate traffic',
            'price_per_hour' => 0.0500,
            'cpu_cores' => 2,
            'memory_mb' => 2048,
            'disk_gb' => 50,
            'bandwidth_gb' => 500,
        ]);

        Plan::factory()->create([
            'name' => 'Pro',
            'slug' => 'pro',
            'description' => 'High-performance plan for demanding applications',
            'price_per_hour' => 0.1000,
            'cpu_cores' => 4,
            'memory_mb' => 4096,
            'disk_gb' => 100,
            'bandwidth_gb' => 1000,
        ]);

        // Create service templates
        Template::factory()->create([
            'name' => 'Node.js',
            'slug' => 'nodejs',
            'description' => 'Fast and scalable Node.js application runtime',
            'docker_image' => 'node:18-alpine',
            'type' => 'service',
            'environment_variables' => [
                'NODE_ENV' => 'production',
                'PORT' => '3000',
            ],
            'exposed_ports' => [3000],
            'icon' => '🟢',
        ]);

        Template::factory()->create([
            'name' => 'Python Flask',
            'slug' => 'python-flask',
            'description' => 'Lightweight Python web framework',
            'docker_image' => 'python:3.11-slim',
            'type' => 'service',
            'environment_variables' => [
                'FLASK_ENV' => 'production',
                'PORT' => '5000',
            ],
            'exposed_ports' => [5000],
            'icon' => '🐍',
        ]);

        Template::factory()->create([
            'name' => 'React App',
            'slug' => 'react-app',
            'description' => 'Modern React application with optimized build',
            'docker_image' => 'nginx:alpine',
            'type' => 'service',
            'environment_variables' => [
                'NODE_ENV' => 'production',
            ],
            'exposed_ports' => [80],
            'icon' => '⚛️',
        ]);

        // Create database templates
        Template::factory()->create([
            'name' => 'PostgreSQL',
            'slug' => 'postgresql',
            'description' => 'Advanced open-source relational database',
            'docker_image' => 'postgres:15-alpine',
            'type' => 'database',
            'environment_variables' => [
                'POSTGRES_PASSWORD' => 'password',
                'POSTGRES_USER' => 'admin',
                'POSTGRES_DB' => 'appdb',
            ],
            'exposed_ports' => [5432],
            'icon' => '🐘',
        ]);

        Template::factory()->create([
            'name' => 'MySQL',
            'slug' => 'mysql',
            'description' => 'Popular open-source relational database',
            'docker_image' => 'mysql:8.0',
            'type' => 'database',
            'environment_variables' => [
                'MYSQL_ROOT_PASSWORD' => 'rootpassword',
                'MYSQL_DATABASE' => 'appdb',
                'MYSQL_USER' => 'admin',
                'MYSQL_PASSWORD' => 'password',
            ],
            'exposed_ports' => [3306],
            'icon' => '🐬',
        ]);

        Template::factory()->create([
            'name' => 'Redis',
            'slug' => 'redis',
            'description' => 'In-memory data structure store and cache',
            'docker_image' => 'redis:7-alpine',
            'type' => 'database',
            'environment_variables' => [
                'REDIS_PASSWORD' => 'password',
            ],
            'exposed_ports' => [6379],
            'icon' => '🔴',
        ]);

        // Create demo user with balance and deployments
        $demoUser = User::factory()->create([
            'name' => 'Demo User',
            'email' => 'demo@appfleet.com',
            'password' => 'password',
        ]);

        UserBalance::factory()->create([
            'user_id' => $demoUser->id,
            'balance' => 25.00,
        ]);

        // Create some balance transactions
        BalanceTransaction::factory()->create([
            'user_id' => $demoUser->id,
            'type' => 'credit',
            'amount' => 50.00,
            'description' => 'Initial account credit',
        ]);

        BalanceTransaction::factory()->create([
            'user_id' => $demoUser->id,
            'type' => 'debit',
            'amount' => 25.00,
            'description' => 'Service deployment charges',
        ]);

        // Create some sample deployments
        Deployment::factory()->create([
            'user_id' => $demoUser->id,
            'template_id' => Template::where('slug', 'nodejs')->first()->id,
            'plan_id' => Plan::where('slug', 'basic')->first()->id,
            'server_id' => Server::first()->id,
            'name' => 'my-api-server',
            'status' => 'running',
            'custom_domain' => 'api.myapp.com',
            'connection_info' => 'https://api.myapp.com',
            'deployed_at' => now()->subDays(5),
            'last_accessed_at' => now()->subHours(2),
        ]);

        Deployment::factory()->create([
            'user_id' => $demoUser->id,
            'template_id' => Template::where('slug', 'postgresql')->first()->id,
            'plan_id' => Plan::where('slug', 'standard')->first()->id,
            'server_id' => Server::first()->id,
            'name' => 'production-db',
            'status' => 'running',
            'connection_info' => 'postgresql://admin:password@db.appfleet.com:5432/appdb',
            'deployed_at' => now()->subDays(10),
            'last_accessed_at' => now()->subMinutes(30),
        ]);
    }
}