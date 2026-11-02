<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLeadRequest;
use App\Models\Lead;
use App\Models\Tariff;
use App\Notifications\NewLeadReceived;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Notification;

class LeadController extends Controller
{
    public function store(StoreLeadRequest $request): RedirectResponse
    {
        $data = $request->validated();

        // Honeypot: bots fill every field; humans never see this one.
        if ($request->filled('website')) {
            return back();
        }

        if (! empty($data['tariff_id']) && empty($data['service_id'])) {
            $data['service_id'] = Tariff::whereKey($data['tariff_id'])->value('service_id');
        }

        $lead = Lead::create([
            ...collect($data)->except('consent')->all(),
            'consent_at' => now(),
            'ip_address' => $request->ip(),
        ]);

        if ($to = config('ascendenet.leads_email')) {
            Notification::route('mail', $to)->notify(new NewLeadReceived($lead));
        }

        return back();
    }
}
