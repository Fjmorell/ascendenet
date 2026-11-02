<?php

namespace Database\Factories;

use App\Models\Service;
use App\Models\Tariff;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Tariff>
 */
class TariffFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'service_id' => Service::factory(),
            'name' => fake()->words(3, true),
            'provider' => 'Orange',
            'price' => fake()->randomFloat(2, 5, 60),
            'features' => [fake()->sentence(3)],
            'is_active' => true,
        ];
    }
}
