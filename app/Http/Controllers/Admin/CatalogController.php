<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\Tariff;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/catalog', [
            'services' => Service::orderBy('sort_order')->with('tariffs')->withCount('leads')->get(),
        ]);
    }

    public function updateService(Request $request, Service $service): RedirectResponse
    {
        $service->update($request->validate([
            'name' => ['required', 'string', 'max:60'],
            'headline' => ['nullable', 'string', 'max:160'],
            'description' => ['nullable', 'string', 'max:500'],
            'status' => ['required', Rule::in(Service::STATUSES)],
        ]));

        return back();
    }

    public function storeTariff(Request $request): RedirectResponse
    {
        $data = $this->validateTariff($request, creating: true);
        $data['sort_order'] = Tariff::where('service_id', $data['service_id'])->max('sort_order') + 1;

        Tariff::create($data);

        return back();
    }

    public function updateTariff(Request $request, Tariff $tariff): RedirectResponse
    {
        $tariff->update($this->validateTariff($request));

        return back();
    }

    public function destroyTariff(Tariff $tariff): RedirectResponse
    {
        $tariff->delete();

        return back();
    }

    /**
     * @return array<string, mixed>
     */
    private function validateTariff(Request $request, bool $creating = false): array
    {
        $data = $request->validate([
            'service_id' => [$creating ? 'required' : 'prohibited', 'exists:services,id'],
            'name' => ['required', 'string', 'max:120'],
            'provider' => ['nullable', 'string', 'max:60'],
            'price' => ['nullable', 'numeric', 'min:0', 'max:9999'],
            'price_label' => ['nullable', 'required_without:price', 'string', 'max:60'],
            'badge' => ['nullable', 'string', 'max:40'],
            'features' => ['array', 'max:8'],
            'features.*' => ['nullable', 'string', 'max:120'],
            'is_featured' => ['boolean'],
            'is_active' => ['boolean'],
        ]);

        $data['features'] = array_values(array_filter($data['features'] ?? [], 'filled'));

        return $data;
    }
}
