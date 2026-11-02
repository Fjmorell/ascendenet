import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { formatDate, type Lead, type LeadStatus, type Paginated, preferredTimeLabels, statusStyles } from '@/types/admin';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Mail, Phone, Search, Trash2 } from 'lucide-react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Leads', href: '/admin/leads' }];

interface LeadsProps {
    leads: Paginated<Lead>;
    filters: { status?: LeadStatus; type?: Lead['type']; search?: string };
    statuses: Record<LeadStatus, string>;
}

const selectClass = 'border-input bg-background h-9 rounded-md border px-3 text-sm';

function LeadDetail({ lead, statuses, onClose }: { lead: Lead; statuses: Record<LeadStatus, string>; onClose: () => void }) {
    const { data, setData, patch, processing, errors, isDirty } = useForm({ status: lead.status, notes: lead.notes ?? '' });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('admin.leads.update', lead.id), { preserveScroll: true, onSuccess: onClose });
    };

    const destroy = () => {
        if (confirm('¿Eliminar este lead definitivamente?')) {
            router.delete(route('admin.leads.destroy', lead.id), { preserveScroll: true, onSuccess: onClose });
        }
    };

    const rows: [string, string | null | undefined][] = [
        ['Tipo', lead.type === 'callback' ? 'Solicitud de llamada' : 'Lista de espera'],
        ['Servicio', lead.service?.name],
        ['Tarifa', lead.tariff?.name],
        ['Código postal', lead.postal_code],
        ['Franja', lead.preferred_time ? preferredTimeLabels[lead.preferred_time] : null],
        ['Origen', lead.source],
        ['Recibido', formatDate(lead.created_at)],
    ];

    return (
        <>
            <SheetHeader>
                <SheetTitle>{lead.name ?? lead.email}</SheetTitle>
                <SheetDescription>Lead #{lead.id}</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-6 px-4 pb-6">
                <div className="flex flex-wrap gap-2">
                    {lead.phone && (
                        <Button asChild size="sm">
                            <a href={`tel:${lead.phone}`}>
                                <Phone /> {lead.phone}
                            </a>
                        </Button>
                    )}
                    {lead.email && (
                        <Button asChild size="sm" variant="outline">
                            <a href={`mailto:${lead.email}`}>
                                <Mail /> {lead.email}
                            </a>
                        </Button>
                    )}
                </div>

                <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                    {rows
                        .filter(([, value]) => value)
                        .map(([label, value]) => (
                            <div key={label} className="contents">
                                <dt className="text-muted-foreground">{label}</dt>
                                <dd>{value}</dd>
                            </div>
                        ))}
                </dl>

                {lead.message && <p className="bg-muted rounded-lg p-3 text-sm whitespace-pre-line">{lead.message}</p>}

                <form onSubmit={submit} className="grid gap-4 border-t pt-6">
                    <div className="grid gap-2">
                        <Label htmlFor="lead-status">Estado</Label>
                        <select
                            id="lead-status"
                            className={selectClass}
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value as LeadStatus)}
                        >
                            {Object.entries(statuses).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="lead-notes">Notas internas</Label>
                        <textarea
                            id="lead-notes"
                            rows={5}
                            className="border-input bg-background rounded-md border px-3 py-2 text-sm"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Ej.: llamado el martes, pide oferta con 2 líneas…"
                        />
                        <InputError message={errors.notes} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={destroy}>
                            <Trash2 /> Eliminar
                        </Button>
                        <Button type="submit" disabled={processing || !isDirty}>
                            Guardar cambios
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default function Leads({ leads, filters, statuses }: LeadsProps) {
    const [selected, setSelected] = useState<Lead | null>(null);
    const [search, setSearch] = useState(filters.search ?? '');
    const firstRender = useRef(true);

    const applyFilters = (changes: Partial<LeadsProps['filters']>) => {
        const query = Object.fromEntries(Object.entries({ ...filters, ...changes }).filter(([, value]) => value));
        router.get(route('admin.leads.index'), query, { preserveState: true, replace: true });
    };

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        const timeout = setTimeout(() => applyFilters({ search }), 350);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leads" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative min-w-56 flex-1 sm:max-w-xs">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar nombre, teléfono, CP…"
                            className="pl-9"
                        />
                    </div>
                    <select
                        className={selectClass}
                        value={filters.status ?? ''}
                        onChange={(e) => applyFilters({ status: (e.target.value || undefined) as LeadStatus })}
                    >
                        <option value="">Todos los estados</option>
                        {Object.entries(statuses).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                    <select
                        className={selectClass}
                        value={filters.type ?? ''}
                        onChange={(e) => applyFilters({ type: (e.target.value || undefined) as Lead['type'] })}
                    >
                        <option value="">Todos los tipos</option>
                        <option value="callback">Solicitudes de llamada</option>
                        <option value="waitlist">Lista de espera</option>
                    </select>
                    <span className="text-muted-foreground ml-auto text-sm">{leads.total} resultados</span>
                </div>

                <div className="bg-card overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="text-muted-foreground border-b text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Contacto</th>
                                <th className="px-4 py-3 font-medium">Interés</th>
                                <th className="px-4 py-3 font-medium">CP</th>
                                <th className="px-4 py-3 font-medium">Estado</th>
                                <th className="px-4 py-3 text-right font-medium">Recibido</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {leads.data.map((lead) => (
                                <tr key={lead.id} onClick={() => setSelected(lead)} className="hover:bg-accent/50 cursor-pointer">
                                    <td className="px-4 py-3">
                                        <div className="font-medium">{lead.name ?? lead.email}</div>
                                        <div className="text-muted-foreground">{lead.phone ?? 'Lista de espera'}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {lead.tariff?.name ?? lead.service?.name ?? <span className="text-muted-foreground">Asesoramiento</span>}
                                    </td>
                                    <td className="px-4 py-3 tabular-nums">{lead.postal_code ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={cn(
                                                'rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
                                                statusStyles[lead.status],
                                            )}
                                        >
                                            {statuses[lead.status]}
                                        </span>
                                    </td>
                                    <td className="text-muted-foreground px-4 py-3 text-right whitespace-nowrap tabular-nums">
                                        {formatDate(lead.created_at)}
                                    </td>
                                </tr>
                            ))}
                            {leads.data.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-muted-foreground px-4 py-12 text-center">
                                        No hay leads con estos filtros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {leads.last_page > 1 && (
                    <nav className="flex flex-wrap justify-center gap-1" aria-label="Paginación">
                        {leads.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url ?? '#'}
                                preserveState
                                className={cn(
                                    'min-w-9 rounded-md border px-3 py-1.5 text-center text-sm',
                                    link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-accent',
                                    !link.url && 'pointer-events-none opacity-40',
                                )}
                            >
                                {index === 0 ? '‹ Anterior' : index === leads.links.length - 1 ? 'Siguiente ›' : link.label}
                            </Link>
                        ))}
                    </nav>
                )}
            </div>

            <Sheet open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
                <SheetContent className="w-full overflow-y-auto sm:max-w-md">
                    {selected && <LeadDetail key={selected.id} lead={selected} statuses={statuses} onClose={() => setSelected(null)} />}
                </SheetContent>
            </Sheet>
        </AppLayout>
    );
}
