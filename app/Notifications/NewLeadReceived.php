<?php

namespace App\Notifications;

use App\Models\Lead;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewLeadReceived extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Lead $lead) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $lead = $this->lead->loadMissing(['service', 'tariff']);
        $isCallback = $lead->type === Lead::TYPE_CALLBACK;

        $mail = (new MailMessage)
            ->subject($isCallback
                ? "Nueva solicitud de llamada: {$lead->name}"
                : "Nuevo aviso de lanzamiento: {$lead->service?->name}")
            ->greeting($isCallback ? 'Nueva solicitud de llamada' : 'Nueva suscripción a lista de espera');

        foreach ([
            'Nombre' => $lead->name,
            'Teléfono' => $lead->phone,
            'Email' => $lead->email,
            'Código postal' => $lead->postal_code,
            'Servicio' => $lead->service?->name,
            'Tarifa' => $lead->tariff?->name,
            'Franja preferida' => $lead->preferred_time,
            'Mensaje' => $lead->message,
        ] as $label => $value) {
            if (filled($value)) {
                $mail->line("**{$label}:** {$value}");
            }
        }

        return $mail->action('Ver en el panel', route('admin.leads.index'));
    }
}
