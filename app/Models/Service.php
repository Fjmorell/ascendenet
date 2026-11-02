<?php

namespace App\Models;

use Database\Factories\ServiceFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    /** @use HasFactory<ServiceFactory> */
    use HasFactory;

    public const STATUS_ACTIVE = 'active';

    public const STATUS_SOON = 'soon';

    public const STATUS_HIDDEN = 'hidden';

    public const STATUSES = [self::STATUS_ACTIVE, self::STATUS_SOON, self::STATUS_HIDDEN];

    protected $fillable = [
        'slug',
        'name',
        'headline',
        'description',
        'status',
        'sort_order',
    ];

    public function tariffs(): HasMany
    {
        return $this->hasMany(Tariff::class)->orderBy('sort_order');
    }

    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class);
    }

    public function scopeVisible(Builder $query): void
    {
        $query->where('status', '!=', self::STATUS_HIDDEN)->orderBy('sort_order');
    }
}
