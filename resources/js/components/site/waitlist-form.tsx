import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { Link, useForm } from '@inertiajs/react';
import { CheckCircle2, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function WaitlistForm({ serviceId, serviceName }: { serviceId: number; serviceName: string }) {
    const [sent, setSent] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'waitlist',
        service_id: serviceId,
        email: '',
        consent: false as boolean,
        website: '',
        source: `waitlist-${serviceName.toLowerCase()}`,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('leads.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setSent(true);
            },
        });
    };

    if (sent) {
        return (
            <p className="flex items-center gap-2 font-medium text-emerald-300" role="status">
                <CheckCircle2 className="size-5" /> Hecho. Te escribiremos en cuanto lancemos {serviceName.toLowerCase()}.
            </p>
        );
    }

    return (
        <form onSubmit={submit} className="relative grid gap-3" noValidate>
            <div className="flex flex-col gap-2 sm:flex-row">
                <label htmlFor={`waitlist-${serviceId}`} className="sr-only">
                    Email
                </label>
                <input
                    id={`waitlist-${serviceId}`}
                    type="email"
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="tu@email.com"
                    className="h-11 flex-1 rounded-lg border border-white/15 bg-white/10 px-3.5 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-4 focus:ring-white/10 focus:outline-none"
                />
                <button
                    type="submit"
                    disabled={processing}
                    className="text-brand-navy inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 font-semibold transition hover:bg-slate-100 disabled:opacity-60"
                >
                    {processing && <LoaderCircle className="size-4 animate-spin" />}
                    Avisadme
                </button>
            </div>
            <InputError message={errors.email} className="text-red-300" />
            <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
                value={data.website}
                onChange={(e) => setData('website', e.target.value)}
            />
            <label className="flex items-start gap-2.5 text-xs leading-snug text-white/70">
                <Checkbox
                    className="mt-px border-white/40"
                    checked={data.consent}
                    onCheckedChange={(checked) => setData('consent', checked === true)}
                />
                <span>
                    Acepto recibir un único email cuando el servicio esté disponible (
                    <Link href={route('legal', 'privacidad')} className="underline underline-offset-2">
                        privacidad
                    </Link>
                    ).
                </span>
            </label>
            <InputError message={errors.consent} className="text-red-300" />
        </form>
    );
}
