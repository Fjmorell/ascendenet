<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\Tariff;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('dashboard', [
            'stats' => [
                'new' => Lead::where('status', 'new')->count(),
                'last7days' => Lead::where('created_at', '>=', now()->subDays(7))->count(),
                'won' => Lead::where('status', 'won')->count(),
                'activeTariffs' => Tariff::active()->count(),
            ],
            'latestLeads' => Lead::with(['service:id,name', 'tariff:id,name'])
                ->latest()
                ->limit(8)
                ->get(),
            'statuses' => Lead::STATUSES,
        ]);
    }
}
