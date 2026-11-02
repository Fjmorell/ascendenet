<?php

namespace Tests\Feature;

use App\Models\Lead;
use App\Models\Service;
use App\Models\Tariff;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_admin_pages()
    {
        $this->get('/admin/leads')->assertRedirect('/login');
        $this->get('/admin/catalogo')->assertRedirect('/login');
    }

    public function test_leads_can_be_filtered_by_status()
    {
        Lead::factory()->create(['status' => 'new']);
        Lead::factory()->create(['status' => 'won']);

        $this->actingAs(User::factory()->create())
            ->get('/admin/leads?status=won')
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/leads')
                ->has('leads.data', 1)
                ->where('leads.data.0.status', 'won'));
    }

    public function test_a_lead_status_and_notes_can_be_updated()
    {
        $lead = Lead::factory()->create();

        $this->actingAs(User::factory()->create())
            ->patch("/admin/leads/{$lead->id}", ['status' => 'contacted', 'notes' => 'Llamar el lunes'])
            ->assertRedirect();

        $this->assertSame('contacted', $lead->fresh()->status);
        $this->assertSame('Llamar el lunes', $lead->fresh()->notes);
    }

    public function test_tariffs_can_be_created_and_updated()
    {
        $service = Service::factory()->create();
        $this->actingAs(User::factory()->create());

        $this->post('/admin/tariffs', [
            'service_id' => $service->id,
            'name' => 'Fibra 1 Gb',
            'price' => '39.90',
            'features' => ['Fibra 1 Gb', ''],
            'is_featured' => false,
            'is_active' => true,
        ])->assertSessionHasNoErrors();

        $tariff = Tariff::sole();
        $this->assertSame(['Fibra 1 Gb'], $tariff->features);

        $this->patch("/admin/tariffs/{$tariff->id}", [
            'name' => 'Fibra 1 Gb',
            'price' => null,
            'price_label' => 'Consultar',
            'features' => [],
            'is_featured' => true,
            'is_active' => false,
        ])->assertSessionHasNoErrors();

        $this->assertNull($tariff->fresh()->price);
        $this->assertFalse($tariff->fresh()->is_active);
    }

    public function test_tariff_needs_a_price_or_a_price_label()
    {
        $this->actingAs(User::factory()->create())
            ->post('/admin/tariffs', ['service_id' => Service::factory()->create()->id, 'name' => 'Sin precio'])
            ->assertSessionHasErrors('price_label');
    }

    public function test_service_can_be_switched_from_soon_to_active()
    {
        $service = Service::factory()->soon()->create();

        $this->actingAs(User::factory()->create())
            ->patch("/admin/services/{$service->id}", ['name' => 'Luz', 'status' => 'active'])
            ->assertRedirect();

        $this->assertSame(Service::STATUS_ACTIVE, $service->fresh()->status);
    }
}
