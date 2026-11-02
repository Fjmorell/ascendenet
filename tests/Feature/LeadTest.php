<?php

namespace Tests\Feature;

use App\Models\Lead;
use App\Models\Service;
use App\Models\Tariff;
use App\Notifications\NewLeadReceived;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LeadTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_lists_visible_services_and_active_tariffs()
    {
        $fibra = Service::factory()->create(['slug' => 'fibra']);
        Tariff::factory()->for($fibra)->create(['name' => 'Publicada']);
        Tariff::factory()->for($fibra)->create(['name' => 'Borrador', 'is_active' => false]);
        Service::factory()->create(['status' => Service::STATUS_HIDDEN]);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('home')
                ->has('services', 1)
                ->has('services.0.tariffs', 1)
                ->where('services.0.tariffs.0.name', 'Publicada'));
    }

    public function test_a_visitor_can_request_a_callback_for_a_tariff()
    {
        Notification::fake();
        config(['ascendenet.leads_email' => 'ventas@example.com']);
        $tariff = Tariff::factory()->create();

        $this->post('/leads', [
            'type' => 'callback',
            'name' => 'Lucía',
            'phone' => '612 34 56 78',
            'postal_code' => '28001',
            'tariff_id' => $tariff->id,
            'consent' => true,
        ])->assertRedirect()->assertSessionHasNoErrors();

        $lead = Lead::sole();
        $this->assertSame('612345678', $lead->phone);
        $this->assertSame($tariff->service_id, $lead->service_id);
        $this->assertNotNull($lead->consent_at);

        Notification::assertSentTo(
            new AnonymousNotifiable,
            NewLeadReceived::class,
            fn ($notification, $channels, $notifiable) => $notifiable->routes['mail'] === 'ventas@example.com',
        );
    }

    public function test_callback_requires_valid_phone_and_consent()
    {
        $this->post('/leads', ['type' => 'callback', 'name' => 'Lucía', 'phone' => '12345'])
            ->assertSessionHasErrors(['phone', 'consent']);

        $this->assertDatabaseCount('leads', 0);
    }

    public function test_a_visitor_can_join_a_waitlist()
    {
        $luz = Service::factory()->soon()->create();

        $this->post('/leads', [
            'type' => 'waitlist',
            'service_id' => $luz->id,
            'email' => 'ana@example.com',
            'consent' => true,
        ])->assertSessionHasNoErrors();

        $this->assertDatabaseHas('leads', ['type' => 'waitlist', 'email' => 'ana@example.com', 'service_id' => $luz->id]);
    }

    public function test_honeypot_submissions_are_silently_discarded()
    {
        $this->post('/leads', [
            'type' => 'callback',
            'name' => 'Bot',
            'phone' => '612345678',
            'consent' => true,
            'website' => 'http://spam.example',
        ])->assertRedirect()->assertSessionHasNoErrors();

        $this->assertDatabaseCount('leads', 0);
    }

    public function test_lead_submissions_are_rate_limited()
    {
        $payload = ['type' => 'callback', 'name' => 'Lucía', 'phone' => '612345678', 'consent' => true];

        for ($i = 0; $i < 3; $i++) {
            $this->post('/leads', $payload)->assertRedirect();
        }

        $this->post('/leads', $payload)->assertTooManyRequests();
    }

    public function test_public_registration_is_disabled()
    {
        $this->get('/register')->assertNotFound();
    }
}
