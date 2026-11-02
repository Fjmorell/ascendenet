export type LeadStatus = 'new' | 'contacted' | 'in_progress' | 'won' | 'lost';

export interface Lead {
    id: number;
    type: 'callback' | 'waitlist';
    name: string | null;
    phone: string | null;
    email: string | null;
    postal_code: string | null;
    preferred_time: 'morning' | 'afternoon' | 'anytime' | null;
    message: string | null;
    status: LeadStatus;
    notes: string | null;
    source: string | null;
    created_at: string;
    service: { id: number; name: string } | null;
    tariff: { id: number; name: string } | null;
}

export interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: { url: string | null; label: string; active: boolean }[];
}

export const statusStyles: Record<LeadStatus, string> = {
    new: 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300',
    contacted: 'bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300',
    in_progress: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
    won: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
    lost: 'bg-neutral-200 text-neutral-700 dark:bg-neutral-500/15 dark:text-neutral-300',
};

export const preferredTimeLabels = {
    morning: 'Mañana',
    afternoon: 'Tarde',
    anytime: 'Cualquier hora',
};

export function formatDate(value: string): string {
    return new Intl.DateTimeFormat('es-ES', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
}
