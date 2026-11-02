import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { type Service } from '@/types/site';
import { Link, useForm } from '@inertiajs/react';
import { CheckCircle2, LoaderCircle, PhoneCall } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface CallbackFormProps {
    services: Service[];
    defaultTariffId?: number | null;
    source: string;
    compact?: boolean;
    className?: string;
}

const fieldClass =
    'h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-[15px] text-slate-900 placeholder:text-slate-400 transition focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/15 focus:outline-none';

export default function CallbackForm({ services, defaultTariffId = null, source, compact = false, className }: CallbackFormProps) {
    const [sent, setSent] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'callback',
        name: '',
        phone: '',
        postal_code: '',
        tariff_id: defaultTariffId ? String(defaultTariffId) : '',
        preferred_time: 'anytime',
        message: '',
        consent: false as boolean,
        website: '',
        source,
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
            <div className={cn('flex flex-col items-center gap-3 py-8 text-center', className)} role="status">
                <CheckCircle2 className="text-brand-green size-12" />
                <p className="font-display text-xl font-bold text-slate-900">¡Recibido!</p>
                <p className="max-w-xs text-slate-600">Un agente te llamará en breve para confirmar cobertura y resolver tus dudas.</p>
                <button type="button" onClick={() => setSent(false)} className="text-brand-blue mt-2 text-sm font-medium hover:underline">
                    Enviar otra solicitud
                </button>
            </div>
        );
    }

    const sellable = services.filter((s) => s.status === 'active' && s.tariffs.length > 0);

    return (
        <form onSubmit={submit} className={cn('relative grid gap-4', className)} noValidate>
            <div className={cn('grid gap-4', !compact && 'sm:grid-cols-2')}>
                <div className="grid gap-1.5">
                    <label htmlFor={`${source}-name`} className="text-sm font-medium text-slate-700">
                        Nombre
                    </label>
                    <input
                        id={`${source}-name`}
                        className={fieldClass}
                        autoComplete="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Tu nombre"
                    />
                    <InputError message={errors.name} />
                </div>
                <div className="grid gap-1.5">
                    <label htmlFor={`${source}-phone`} className="text-sm font-medium text-slate-700">
                        Teléfono
                    </label>
                    <input
                        id={`${source}-phone`}
                        className={fieldClass}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        placeholder="600 000 000"
                    />
                    <InputError message={errors.phone} />
                </div>
            </div>

            <div className={cn('grid gap-4', !compact && 'sm:grid-cols-2')}>
                <div className="grid gap-1.5">
                    <label htmlFor={`${source}-cp`} className="text-sm font-medium text-slate-700">
                        Código postal <span className="font-normal text-slate-400">(para ver cobertura)</span>
                    </label>
                    <input
                        id={`${source}-cp`}
                        className={fieldClass}
                        inputMode="numeric"
                        autoComplete="postal-code"
                        maxLength={5}
                        value={data.postal_code}
                        onChange={(e) => setData('postal_code', e.target.value.replace(/\D/g, ''))}
                        placeholder="28001"
                    />
                    <InputError message={errors.postal_code} />
                </div>
                <div className="grid gap-1.5">
                    <label htmlFor={`${source}-tariff`} className="text-sm font-medium text-slate-700">
                        Me interesa
                    </label>
                    <select
                        id={`${source}-tariff`}
                        className={fieldClass}
                        value={data.tariff_id}
                        onChange={(e) => setData('tariff_id', e.target.value)}
                    >
                        <option value="">Aún no lo sé, asesoradme</option>
                        {sellable.map((service) => (
                            <optgroup key={service.id} label={service.name}>
                                {service.tariffs.map((tariff) => (
                                    <option key={tariff.id} value={tariff.id}>
                                        {tariff.name}
                                        {tariff.price ? ` · ${tariff.price.replace('.', ',')} €/mes` : ''}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>
            </div>

            {!compact && (
                <>
                    <fieldset className="grid gap-1.5">
                        <legend className="mb-1.5 text-sm font-medium text-slate-700">¿Cuándo te llamamos?</legend>
                        <div className="flex flex-wrap gap-2">
                            {[
                                ['anytime', 'Cuando sea'],
                                ['morning', 'Por la mañana'],
                                ['afternoon', 'Por la tarde'],
                            ].map(([value, label]) => (
                                <label
                                    key={value}
                                    className={cn(
                                        'cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition',
                                        data.preferred_time === value
                                            ? 'border-brand-blue bg-brand-mist text-brand-blue'
                                            : 'border-slate-300 text-slate-600 hover:border-slate-400',
                                    )}
                                >
                                    <input
                                        type="radio"
                                        name={`${source}-time`}
                                        value={value}
                                        className="sr-only"
                                        checked={data.preferred_time === value}
                                        onChange={() => setData('preferred_time', value)}
                                    />
                                    {label}
                                </label>
                            ))}
                        </div>
                    </fieldset>
                    <div className="grid gap-1.5">
                        <label htmlFor={`${source}-message`} className="text-sm font-medium text-slate-700">
                            Comentarios <span className="font-normal text-slate-400">(opcional)</span>
                        </label>
                        <textarea
                            id={`${source}-message`}
                            rows={3}
                            className={cn(fieldClass, 'h-auto py-2.5')}
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            placeholder="Ej.: ahora tengo fibra con otra compañía y quiero mantener mi número"
                        />
                        <InputError message={errors.message} />
                    </div>
                </>
            )}

            {/* Honeypot: hidden from people, tempting for bots */}
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

            <div className="grid gap-1.5">
                <label className="flex items-start gap-2.5 text-sm leading-snug text-slate-600">
                    <Checkbox
                        className="mt-0.5 border-slate-400 bg-white"
                        checked={data.consent}
                        onCheckedChange={(checked) => setData('consent', checked === true)}
                    />
                    <span>
                        Acepto que AscendeNet me contacte por teléfono sobre esta solicitud, según la{' '}
                        <Link href={route('legal', 'privacidad')} className="text-brand-blue underline underline-offset-2">
                            política de privacidad
                        </Link>
                        .
                    </span>
                </label>
                <InputError message={errors.consent} />
            </div>

            <button
                type="submit"
                disabled={processing}
                className="bg-brand-navy hover:bg-brand-blue inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 font-semibold text-white shadow-sm transition disabled:opacity-60"
            >
                {processing ? <LoaderCircle className="size-5 animate-spin" /> : <PhoneCall className="size-5" />}
                Que me llamen
            </button>
        </form>
    );
}
