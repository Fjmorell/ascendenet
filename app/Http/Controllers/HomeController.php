<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $services = Service::visible()
            ->with(['tariffs' => fn ($query) => $query->active()])
            ->get()
            ->map(fn (Service $service) => [
                'id' => $service->id,
                'slug' => $service->slug,
                'name' => $service->name,
                'headline' => $service->headline,
                'description' => $service->description,
                'status' => $service->status,
                'tariffs' => $service->tariffs->map(fn ($tariff) => [
                    'id' => $tariff->id,
                    'name' => $tariff->name,
                    'provider' => $tariff->provider,
                    'price' => $tariff->price,
                    'price_label' => $tariff->price_label,
                    'badge' => $tariff->badge,
                    'features' => $tariff->features ?? [],
                    'is_featured' => $tariff->is_featured,
                ]),
            ]);

        return Inertia::render('home', [
            'services' => $services,
        ]);
    }
}
