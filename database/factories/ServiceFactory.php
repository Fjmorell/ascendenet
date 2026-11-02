<?php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'slug' => fake()->unique()->slug(2),
            'name' => fake()->words(2, true),
            'headline' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'status' => Service::STATUS_ACTIVE,
            'sort_order' => 0,
        ];
    }

    public function soon(): static
    {
        return $this->state(fn () => ['status' => Service::STATUS_SOON]);
    }
}
