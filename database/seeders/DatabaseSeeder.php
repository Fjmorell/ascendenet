<?php

namespace Database\Seeders;

use App\Models\Lead;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(CatalogSeeder::class);

        if (app()->isLocal()) {
            User::factory()->create([
                'name' => 'Admin',
                'email' => 'admin@ascendenet.test',
            ]);

            Lead::factory(8)->create();
        }
    }
}
