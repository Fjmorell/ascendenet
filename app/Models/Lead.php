<?php

namespace App\Models;

use Database\Factories\LeadFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lead extends Model
{
    /** @use HasFactory<LeadFactory> */
    use HasFactory;

    public const TYPE_CALLBACK = 'callback';

    public const TYPE_WAITLIST = 'waitlist';

    public const STATUSES = [
        'new' => 'Nuevo',
        'contacted' => 'Contactado',
        'in_progress' => 'En curso',
        'won' => 'Contratado',
        'lost' => 'Descartado',
    ];

    protected $fillable = [
        'type',
        'service_id',
        'tariff_id',
        'name',
        'phone',
        'email',
        'postal_code',
        'preferred_time',
        'message',
        'status',
        'notes',
        'consent_at',
        'ip_address',
        'source',
    ];

    protected function casts(): array
    {
        return [
            'consent_at' => 'datetime',
        ];
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function tariff(): BelongsTo
    {
        return $this->belongsTo(Tariff::class);
    }
}
