import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { services } from '@/data/site';
import { type Errors, isSpanishPhone, normalizePhone, submitNetlifyForm } from '@/lib/netlify-form';
import { cn } from '@/lib/utils';
import { CheckCircle2, LoaderCircle, PhoneCall } from 'lucide-react';
import { type FormEvent, useState } from 'react';

interface CallbackFormProps {
    defaultTariffId?: string;
    source: string;
    compact?: boolean;
    className?: string;
}

const fieldClass =
    'h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-[15px] text-slate-900 placeholder:text-slate-400 transition focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/15 focus:outline-none';

const timeOptions = [
    ['Cuando sea', 'Cuando sea'],
    ['Mañana', 'Por la mañana'],
    ['Tarde', 'Por la tarde'],
] as const;

const sellable = services.filter((s) => s.status === 'active' && s.tariffs.length > 0);

function tariffLabel(id: string): string {
    for (const service of sellable) {
        const tariff = service.tariffs.find((t) => t.id === id);
        if (tariff) {
            return `${service.name} · ${tariff.name}${tariff.price ? ` (${tariff.price.replace('.', ',')} €/mes)` : ''}`;
        }
    }
    return 'Sin decidir, quiere asesoramiento';
}

type Field = 'name' | 'phone' | 'postalCode' | 'consent' | 'form';

export default function CallbackForm({ defaultTariffId = '', source, compact = false, className }: CallbackFormProps) {
    const [data, setData] = useState({
        name: '',
        phone: '',
        postalCode: '',
        tariffId: defaultTariffId,
        time: 'Cuando sea',
        message: '',
        consent: false,
        botField: '',
    });
    const [errors, setErrors] = useState<Errors<Field>>({});
    const [processing, setProcessing] = useState(false);
    const [sent, setSent] = useState(false);

    const set = <K extends keyof typeof data>(key: K, value: (typeof data)[K]) => setData((current) => ({ ...current, [key]: value }));

    const validate = (): Errors<Field> => {
        const found: Errors<Field> = {};
        if (!data.name.trim()) found.name = 'Dinos tu nombre.';
        if (!data.phone.trim()) found.phone = 'Necesitamos un teléfono para llamarte.';
        else if (!isSpanishPhone(data.phone)) found.phone = 'Introduce un teléfono español válido (9 dígitos).';
        if (data.postalCode && !/^\d{5}$/.test(data.postalCode)) found.postalCode = 'El código postal tiene 5 dígitos.';
        if (!data.consent) found.consent = 'Debes aceptar la política de privacidad.';
        return found;
    };

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        const found = validate();
        setErrors(found);
        if (Object.keys(found).length > 0) return;

        setProcessing(true);
        try {
            await submitNetlifyForm('contacto', {
                'bot-field': data.botField,
                nombre: data.name.trim(),
                telefono: normalizePhone(data.phone),
                codigo_postal: data.postalCode,
                tarifa: tariffLabel(data.tariffId),
                franja: data.time,
                comentarios: data.message.trim(),
                consentimiento: `Sí, ${new Date().toISOString()}`,
                origen: source,
            });
            setSent(true);
        } catch {
            setErrors({ form: 'No hemos podido enviar tu solicitud. Inténtalo de nuevo en unos minutos.' });
        } finally {
            setProcessing(false);
        }
    };

    if (sent) {
        return (
            <div className={cn('flex flex-col items-center gap-3 py-8 text-center', className)} role="status">
                <CheckCircle2 className="text-brand-green size-12" />
                <p className="font-display text-xl font-bold text-slate-900">¡Recibido!</p>
                <p className="max-w-xs text-slate-600">Un agente te llamará en breve para confirmar cobertura y resolver tus dudas.</p>
            </div>
        );
    }

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
                        onChange={(e) => set('name', e.target.value)}
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
                        onChange={(e) => set('phone', e.target.value)}
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
                        value={data.postalCode}
                        onChange={(e) => set('postalCode', e.target.value.replace(/\D/g, ''))}
                        placeholder="28001"
                    />
                    <InputError message={errors.postalCode} />
                </div>
                <div className="grid gap-1.5">
                    <label htmlFor={`${source}-tariff`} className="text-sm font-medium text-slate-700">
                        Me interesa
                    </label>
                    <select id={`${source}-tariff`} className={fieldClass} value={data.tariffId} onChange={(e) => set('tariffId', e.target.value)}>
                        <option value="">Aún no lo sé, asesoradme</option>
                        {sellable.map((service) => (
                            <optgroup key={service.slug} label={service.name}>
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
                            {timeOptions.map(([value, label]) => (
                                <label
                                    key={value}
                                    className={cn(
                                        'cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition',
                                        data.time === value
                                            ? 'border-brand-blue bg-brand-mist text-brand-blue'
                                            : 'border-slate-300 text-slate-600 hover:border-slate-400',
                                    )}
                                >
                                    <input
                                        type="radio"
                                        name={`${source}-time`}
                                        value={value}
                                        className="sr-only"
                                        checked={data.time === value}
                                        onChange={() => set('time', value)}
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
                            maxLength={1000}
                            className={cn(fieldClass, 'h-auto py-2.5')}
                            value={data.message}
                            onChange={(e) => set('message', e.target.value)}
                            placeholder="Ej.: ahora tengo fibra con otra compañía y quiero mantener mi número"
                        />
                    </div>
                </>
            )}

            {/* Honeypot: hidden from people, tempting for bots (Netlify discards submissions that fill it) */}
            <input
                type="text"
                name="bot-field"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
                value={data.botField}
                onChange={(e) => set('botField', e.target.value)}
            />

            <div className="grid gap-1.5">
                <label className="flex items-start gap-2.5 text-sm leading-snug text-slate-600">
                    <Checkbox
                        className="mt-0.5 border-slate-400 bg-white"
                        checked={data.consent}
                        onCheckedChange={(checked) => set('consent', checked === true)}
                    />
                    <span>
                        Acepto que AscendeNet me contacte por teléfono sobre esta solicitud, según la{' '}
                        <a href="/privacidad" className="text-brand-blue underline underline-offset-2">
                            política de privacidad
                        </a>
                        .
                    </span>
                </label>
                <InputError message={errors.consent} />
            </div>

            <InputError message={errors.form} />

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
