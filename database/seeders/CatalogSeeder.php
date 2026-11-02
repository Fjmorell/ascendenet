<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

/**
 * Initial catalog, taken from the tariffs published on the previous site.
 * Safe to re-run: services are matched by slug and tariffs by name.
 */
class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $catalog = [
            [
                'slug' => 'fibra',
                'name' => 'Fibra',
                'headline' => 'Fibra Orange para tu casa',
                'description' => 'Fibra óptica sola o con líneas móviles. Te confirmamos cobertura en tu dirección antes de contratar.',
                'status' => Service::STATUS_ACTIVE,
                'tariffs' => [
                    [
                        'name' => 'Fibra 600 Mb + 2 líneas',
                        'price' => 34.99,
                        'badge' => 'Más elegida',
                        'is_featured' => true,
                        'features' => ['Fibra 600 Mb', '2 líneas móviles de 30 GB', 'Gigas acumulables'],
                    ],
                    [
                        'name' => 'Fibra 300 Mb + 2 líneas',
                        'price' => 29.95,
                        'features' => ['Fibra 300 Mb', '2 líneas móviles de 30 GB', 'Gigas acumulables'],
                    ],
                    [
                        'name' => 'Fibra 600 Mb',
                        'price' => 25.99,
                        'features' => ['Fibra 600 Mb', 'Solo fibra, sin móvil'],
                    ],
                ],
            ],
            [
                'slug' => 'movil',
                'name' => 'Móvil',
                'headline' => 'Líneas móviles con gigas acumulables',
                'description' => 'Contrátala sola o súmala a tu fibra. Los gigas que no gastas pasan al mes siguiente.',
                'status' => Service::STATUS_ACTIVE,
                'tariffs' => [
                    [
                        'name' => 'Móvil 30 GB + llamadas ilimitadas',
                        'price' => 9.99,
                        'badge' => 'Promo +20 GB',
                        'is_featured' => true,
                        'features' => ['30 GB acumulables', 'Llamadas ilimitadas', 'Bono promocional de +20 GB'],
                    ],
                ],
            ],
            [
                'slug' => 'internet-rural',
                'name' => 'Sin fibra',
                'headline' => 'Internet donde no llega la fibra',
                'description' => 'Rural, satélite o 4G/5G: estudiamos tu ubicación y te proponemos la mejor opción disponible.',
                'status' => Service::STATUS_ACTIVE,
                'tariffs' => [
                    ['name' => 'Internet 4G / 5G', 'price_label' => 'Según cobertura', 'features' => ['Router con tarjeta de datos', 'Sin obras ni instalación']],
                    ['name' => 'Internet rural', 'price_label' => 'Según cobertura', 'features' => ['Radioenlace en zonas rurales', 'Instalación en tu vivienda']],
                    ['name' => 'Internet por satélite', 'price_label' => 'Según cobertura', 'features' => ['Cobertura en cualquier ubicación', 'Ideal para casas aisladas']],
                ],
            ],
            [
                'slug' => 'luz',
                'name' => 'Luz',
                'headline' => 'Tarifas de luz claras, sin letra pequeña',
                'description' => 'Estamos cerrando acuerdos con comercializadoras. Déjanos tu email y te avisamos con la primera oferta antes que nadie.',
                'status' => Service::STATUS_SOON,
                'tariffs' => [],
            ],
            [
                'slug' => 'alarma',
                'name' => 'Alarma',
                'headline' => 'Seguridad para tu hogar',
                'description' => 'Estamos seleccionando sistemas de alarma con instalación y app incluidas. Te avisamos en cuanto estén disponibles.',
                'status' => Service::STATUS_SOON,
                'tariffs' => [],
            ],
        ];

        foreach ($catalog as $order => $data) {
            $tariffs = $data['tariffs'];
            unset($data['tariffs']);

            $service = Service::updateOrCreate(['slug' => $data['slug']], [...$data, 'sort_order' => $order]);

            foreach ($tariffs as $tariffOrder => $tariff) {
                $service->tariffs()->updateOrCreate(
                    ['name' => $tariff['name']],
                    ['provider' => 'Orange', 'sort_order' => $tariffOrder, ...$tariff],
                );
            }
        }
    }
}
