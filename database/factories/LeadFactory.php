<?php

namespace Database\Factories;

use App\Models\Lead;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Lead>
 */
class LeadFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => Lead::TYPE_CALLBACK,
            'name' => fake()->name(),
            'phone' => '6'.fake()->numerify('########'),
            'postal_code' => fake()->numerify('28###'),
            'status' => 'new',
            'consent_at' => now(),
        ];
    }
}
