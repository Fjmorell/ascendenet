/**
 * Site content: edit this file to change tariffs, contact details or legal data,
 * then commit and push — Netlify redeploys automatically.
 */

export interface Tariff {
    id: string;
    name: string;
    provider?: string;
    /** Monthly price, e.g. "34.99". Leave undefined to show `priceLabel` instead. */
    price?: string;
    priceLabel?: string;
    badge?: string;
    features: string[];
    featured?: boolean;
}

export interface Service {
    slug: string;
    name: string;
    headline: string;
    description: string;
    /** "active" shows tariffs; "soon" shows a waitlist form. Remove the entry to hide it. */
    status: 'active' | 'soon';
    tariffs: Tariff[];
}

export const contact = {
    phone: '', // e.g. '600 000 000'
    whatsapp: '', // international format without "+", e.g. '34600000000'
    email: '', // e.g. 'hola@ascendenet.com'
    hours: 'Lunes a viernes, de 9:00 a 20:00',
};

export const legal = {
    companyName: '[Razón social]',
    taxId: '[NIF/CIF]',
    address: '[Domicilio social]',
    email: '[email de contacto]',
    siteUrl: 'https://ascendenet.com',
};

export const services: Service[] = [
    {
        slug: 'fibra',
        name: 'Fibra',
        headline: 'Fibra Orange para tu casa',
        description: 'Fibra óptica sola o con líneas móviles. Te confirmamos cobertura en tu dirección antes de contratar.',
        status: 'active',
        tariffs: [
            {
                id: 'fibra-600-2lineas',
                name: 'Fibra 600 Mb + 2 líneas',
                provider: 'Orange',
                price: '34.99',
                badge: 'Más elegida',
                featured: true,
                features: ['Fibra 600 Mb', '2 líneas móviles de 30 GB', 'Gigas acumulables'],
            },
            {
                id: 'fibra-300-2lineas',
                name: 'Fibra 300 Mb + 2 líneas',
                provider: 'Orange',
                price: '29.95',
                features: ['Fibra 300 Mb', '2 líneas móviles de 30 GB', 'Gigas acumulables'],
            },
            {
                id: 'fibra-600',
                name: 'Fibra 600 Mb',
                provider: 'Orange',
                price: '25.99',
                features: ['Fibra 600 Mb', 'Solo fibra, sin móvil'],
            },
        ],
    },
    {
        slug: 'movil',
        name: 'Móvil',
        headline: 'Líneas móviles con gigas acumulables',
        description: 'Contrátala sola o súmala a tu fibra. Los gigas que no gastas pasan al mes siguiente.',
        status: 'active',
        tariffs: [
            {
                id: 'movil-30gb',
                name: 'Móvil 30 GB + llamadas ilimitadas',
                provider: 'Orange',
                price: '9.99',
                badge: 'Promo +20 GB',
                featured: true,
                features: ['30 GB acumulables', 'Llamadas ilimitadas', 'Bono promocional de +20 GB'],
            },
        ],
    },
    {
        slug: 'internet-rural',
        name: 'Sin fibra',
        headline: 'Internet donde no llega la fibra',
        description: 'Rural, satélite o 4G/5G: estudiamos tu ubicación y te proponemos la mejor opción disponible.',
        status: 'active',
        tariffs: [
            {
                id: 'internet-4g5g',
                name: 'Internet 4G / 5G',
                priceLabel: 'Según cobertura',
                features: ['Router con tarjeta de datos', 'Sin obras ni instalación'],
            },
            {
                id: 'internet-rural',
                name: 'Internet rural',
                priceLabel: 'Según cobertura',
                features: ['Radioenlace en zonas rurales', 'Instalación en tu vivienda'],
            },
            {
                id: 'internet-satelite',
                name: 'Internet por satélite',
                priceLabel: 'Según cobertura',
                features: ['Cobertura en cualquier ubicación', 'Ideal para casas aisladas'],
            },
        ],
    },
    {
        slug: 'luz',
        name: 'Luz',
        headline: 'Tarifas de luz claras, sin letra pequeña',
        description: 'Estamos cerrando acuerdos con comercializadoras. Déjanos tu email y te avisamos con la primera oferta antes que nadie.',
        status: 'soon',
        tariffs: [],
    },
    {
        slug: 'alarma',
        name: 'Alarma',
        headline: 'Seguridad para tu hogar',
        description: 'Estamos seleccionando sistemas de alarma con instalación y app incluidas. Te avisamos en cuanto estén disponibles.',
        status: 'soon',
        tariffs: [],
    },
];

export function formatPrice(price: string): { whole: string; cents: string } {
    const [whole, cents = '00'] = price.split('.');
    return { whole, cents };
}
