import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Star, Trash2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Servicios y tarifas', href: '/admin/catalogo' }];

interface AdminTariff {
    id: number;
    service_id: number;
    name: string;
    provider: string | null;
    price: string | null;
    price_label: string | null;
    badge: string | null;
    features: string[] | null;
    is_featured: boolean;
    is_active: boolean;
}

interface AdminService {
    id: number;
    slug: string;
    name: string;
    headline: string | null;
    description: string | null;
    status: 'active' | 'soon' | 'hidden';
    leads_count: number;
    tariffs: AdminTariff[];
}

const statusLabels = { active: 'Activo', soon: 'Próximamente', hidden: 'Oculto' };

const statusStyles = {
    active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
    soon: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
    hidden: 'bg-neutral-200 text-neutral-700 dark:bg-neutral-500/15 dark:text-neutral-300',
};

const textareaClass = 'border-input bg-background rounded-md border px-3 py-2 text-sm';

function ServiceForm({ service, onDone }: { service: AdminService; onDone: () => void }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: service.name,
        headline: service.headline ?? '',
        description: service.description ?? '',
        status: service.status,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('admin.services.update', service.id), { preserveScroll: true, onSuccess: onDone });
    };

    return (
        <form onSubmit={submit} className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="service-name">Nombre (pestaña)</Label>
                <Input id="service-name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                <InputError message={errors.name} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="service-headline">Titular</Label>
                <Input id="service-headline" value={data.headline} onChange={(e) => setData('headline', e.target.value)} />
                <InputError message={errors.headline} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="service-description">Descripción</Label>
                <textarea
                    id="service-description"
                    rows={3}
                    className={textareaClass}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                />
                <InputError message={errors.description} />
            </div>
            <div className="grid gap-2">
                <Label>Estado en la web</Label>
                <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(statusLabels) as AdminService['status'][]).map((status) => (
                        <button
                            key={status}
                            type="button"
                            onClick={() => setData('status', status)}
                            className={cn(
                                'rounded-md border px-3 py-2 text-sm',
                                data.status === status ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-accent',
                            )}
                        >
                            {statusLabels[status]}
                        </button>
                    ))}
                </div>
                <p className="text-muted-foreground text-xs">
                    «Próximamente» muestra el servicio con un formulario de lista de espera. «Oculto» lo retira de la web.
                </p>
            </div>
            <DialogFooter>
                <Button type="submit" disabled={processing}>
                    Guardar
                </Button>
            </DialogFooter>
        </form>
    );
}

function TariffForm({ serviceId, tariff, onDone }: { serviceId: number; tariff: AdminTariff | null; onDone: () => void }) {
    const { data, setData, post, patch, processing, errors, transform } = useForm({
        service_id: serviceId,
        name: tariff?.name ?? '',
        provider: tariff?.provider ?? 'Orange',
        price: tariff?.price ?? '',
        price_label: tariff?.price_label ?? '',
        badge: tariff?.badge ?? '',
        features: (tariff?.features ?? []).join('\n'),
        is_featured: tariff?.is_featured ?? false,
        is_active: tariff?.is_active ?? true,
    });

    transform(({ service_id, features, price, ...rest }) => ({
        ...rest,
        ...(tariff ? {} : { service_id }),
        price: price === '' ? null : String(price).replace(',', '.'),
        features: features
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean),
    }));

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const options = { preserveScroll: true, onSuccess: onDone };
        if (tariff) {
            patch(route('admin.tariffs.update', tariff.id), options);
        } else {
            post(route('admin.tariffs.store'), options);
        }
    };

    return (
        <form onSubmit={submit} className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
                <div className="grid gap-2">
                    <Label htmlFor="tariff-name">Nombre</Label>
                    <Input
                        id="tariff-name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Fibra 600 Mb + 2 líneas"
                    />
                    <InputError message={errors.name} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="tariff-provider">Operador</Label>
                    <Input id="tariff-provider" value={data.provider} onChange={(e) => setData('provider', e.target.value)} />
                </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="grid gap-2">
                    <Label htmlFor="tariff-price">Precio €/mes</Label>
                    <Input
                        id="tariff-price"
                        inputMode="decimal"
                        value={data.price}
                        onChange={(e) => setData('price', e.target.value)}
                        placeholder="29,95"
                    />
                    <InputError message={errors.price} />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="tariff-price-label">Texto si no hay precio</Label>
                    <Input
                        id="tariff-price-label"
                        value={data.price_label}
                        onChange={(e) => setData('price_label', e.target.value)}
                        placeholder="Según cobertura"
                    />
                    <InputError message={errors.price_label} />
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="tariff-badge">Etiqueta destacada</Label>
                <Input id="tariff-badge" value={data.badge} onChange={(e) => setData('badge', e.target.value)} placeholder="Más elegida, Promo…" />
                <InputError message={errors.badge} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="tariff-features">Características (una por línea)</Label>
                <textarea
                    id="tariff-features"
                    rows={4}
                    className={textareaClass}
                    value={data.features}
                    onChange={(e) => setData('features', e.target.value)}
                />
                <InputError message={errors.features} />
            </div>
            <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm">
                    <Checkbox checked={data.is_featured} onCheckedChange={(checked) => setData('is_featured', checked === true)} />
                    Destacar
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <Checkbox checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked === true)} />
                    Publicada en la web
                </label>
            </div>
            <DialogFooter>
                <Button type="submit" disabled={processing}>
                    {tariff ? 'Guardar cambios' : 'Crear tarifa'}
                </Button>
            </DialogFooter>
        </form>
    );
}

type Editing = { kind: 'service'; service: AdminService } | { kind: 'tariff'; serviceId: number; tariff: AdminTariff | null } | null;

export default function Catalog({ services }: { services: AdminService[] }) {
    const [editing, setEditing] = useState<Editing>(null);
    const close = () => setEditing(null);

    const destroyTariff = (tariff: AdminTariff) => {
        if (confirm(`¿Eliminar la tarifa «${tariff.name}»?`)) {
            router.delete(route('admin.tariffs.destroy', tariff.id), { preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Servicios y tarifas" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {services.map((service) => (
                    <section key={service.id} className="bg-card rounded-xl border">
                        <header className="flex flex-wrap items-center gap-3 border-b px-5 py-4">
                            <h2 className="text-lg font-semibold">{service.name}</h2>
                            <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', statusStyles[service.status])}>
                                {statusLabels[service.status]}
                            </span>
                            <span className="text-muted-foreground text-sm">{service.leads_count} leads</span>
                            <div className="ml-auto flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setEditing({ kind: 'service', service })}>
                                    <Pencil /> Editar servicio
                                </Button>
                                <Button size="sm" onClick={() => setEditing({ kind: 'tariff', serviceId: service.id, tariff: null })}>
                                    <Plus /> Nueva tarifa
                                </Button>
                            </div>
                        </header>

                        {service.tariffs.length === 0 ? (
                            <p className="text-muted-foreground px-5 py-6 text-sm">
                                {service.status === 'soon'
                                    ? 'Sin tarifas: en la web se muestra la lista de espera.'
                                    : 'Este servicio no tiene tarifas todavía.'}
                            </p>
                        ) : (
                            <ul className="divide-y">
                                {service.tariffs.map((tariff) => (
                                    <li
                                        key={tariff.id}
                                        className={cn(
                                            'flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 text-sm',
                                            !tariff.is_active && 'opacity-50',
                                        )}
                                    >
                                        <span className="flex min-w-60 flex-1 items-center gap-2 font-medium">
                                            {tariff.is_featured && <Star className="size-4 fill-amber-400 text-amber-400" />}
                                            {tariff.name}
                                            {tariff.badge && (
                                                <span className="bg-muted rounded px-1.5 py-0.5 text-xs font-normal">{tariff.badge}</span>
                                            )}
                                        </span>
                                        <span className="w-32 tabular-nums">
                                            {tariff.price ? `${tariff.price.replace('.', ',')} €/mes` : tariff.price_label}
                                        </span>
                                        <span className="text-muted-foreground w-24">{tariff.is_active ? 'Publicada' : 'Borrador'}</span>
                                        <span className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setEditing({ kind: 'tariff', serviceId: service.id, tariff })}
                                                aria-label="Editar"
                                            >
                                                <Pencil />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive"
                                                onClick={() => destroyTariff(tariff)}
                                                aria-label="Eliminar"
                                            >
                                                <Trash2 />
                                            </Button>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                ))}
            </div>

            <Dialog open={editing !== null} onOpenChange={(open) => !open && close()}>
                <DialogContent className="sm:max-w-lg">
                    {editing?.kind === 'service' && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Editar servicio</DialogTitle>
                                <DialogDescription>Textos y visibilidad de «{editing.service.name}» en la web.</DialogDescription>
                            </DialogHeader>
                            <ServiceForm key={editing.service.id} service={editing.service} onDone={close} />
                        </>
                    )}
                    {editing?.kind === 'tariff' && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{editing.tariff ? 'Editar tarifa' : 'Nueva tarifa'}</DialogTitle>
                                <DialogDescription>Los cambios se publican al instante en la web.</DialogDescription>
                            </DialogHeader>
                            <TariffForm key={editing.tariff?.id ?? 'new'} serviceId={editing.serviceId} tariff={editing.tariff} onDone={close} />
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
