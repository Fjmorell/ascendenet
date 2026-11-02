export interface Tariff {
    id: number;
    name: string;
    provider: string | null;
    price: string | null;
    price_label: string | null;
    badge: string | null;
    features: string[];
    is_featured: boolean;
}

export interface Service {
    id: number;
    slug: string;
    name: string;
    headline: string | null;
    description: string | null;
    status: 'active' | 'soon' | 'hidden';
    tariffs: Tariff[];
}

export interface Contact {
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    hours: string;
}

export function formatPrice(price: string): { whole: string; cents: string } {
    const [whole, cents = '00'] = price.split('.');
    return { whole, cents };
}
