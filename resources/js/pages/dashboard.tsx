import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { formatDate, type Lead, type LeadStatus, statusStyles } from '@/types/admin';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CalendarDays, Inbox, Tags, Trophy } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Resumen',
        href: '/dashboard',
    },
];

interface DashboardProps {
    stats: { new: number; last7days: number; won: number; activeTariffs: number };
    latestLeads: Lead[];
    statuses: Record<LeadStatus, string>;
}

export default function Dashboard({ stats, latestLeads, statuses }: DashboardProps) {
    const cards = [
        { label: 'Leads sin atender', value: stats.new, icon: Inbox, href: route('admin.leads.index', { status: 'new' }) },
        { label: 'Leads últimos 7 días', value: stats.last7days, icon: CalendarDays, href: route('admin.leads.index') },
        { label: 'Contratados', value: stats.won, icon: Trophy, href: route('admin.leads.index', { status: 'won' }) },
        { label: 'Tarifas publicadas', value: stats.activeTariffs, icon: Tags, href: route('admin.catalog.index') },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Resumen" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {cards.map(({ label, value, icon: Icon, href }) => (
                        <Link key={label} href={href} className="bg-card hover:bg-accent/50 rounded-xl border p-5 transition">
                            <div className="text-muted-foreground flex items-center justify-between text-sm">
                                {label}
                                <Icon className="size-4" />
                            </div>
                            <p className="mt-3 text-3xl font-semibold tabular-nums">{value}</p>
                        </Link>
                    ))}
                </div>

                <div className="bg-card rounded-xl border">
                    <div className="flex items-center justify-between border-b px-5 py-4">
                        <h2 className="font-semibold">Últimos leads</h2>
                        <Link
                            href={route('admin.leads.index')}
                            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm"
                        >
                            Ver todos <ArrowRight className="size-4" />
                        </Link>
                    </div>
                    {latestLeads.length === 0 ? (
                        <p className="text-muted-foreground px-5 py-10 text-center text-sm">
                            Todavía no hay leads. Aparecerán aquí cuando alguien rellene un formulario.
                        </p>
                    ) : (
                        <ul className="divide-y">
                            {latestLeads.map((lead) => (
                                <li key={lead.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 text-sm">
                                    <span className="min-w-40 font-medium">{lead.name ?? lead.email}</span>
                                    <span className="text-muted-foreground min-w-28">
                                        {lead.phone ?? (lead.type === 'waitlist' ? 'Lista de espera' : '')}
                                    </span>
                                    <span className="text-muted-foreground flex-1 truncate">
                                        {lead.tariff?.name ?? lead.service?.name ?? 'Sin especificar'}
                                    </span>
                                    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', statusStyles[lead.status])}>
                                        {statuses[lead.status]}
                                    </span>
                                    <span className="text-muted-foreground w-28 text-right tabular-nums">{formatDate(lead.created_at)}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
