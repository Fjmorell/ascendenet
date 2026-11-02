import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { type Errors, isEmail, submitNetlifyForm } from '@/lib/netlify-form';
import { CheckCircle2, LoaderCircle } from 'lucide-react';
import { type FormEvent, useState } from 'react';

export default function WaitlistForm({ serviceName }: { serviceName: string }) {
    const [email, setEmail] = useState('');
    const [consent, setConsent] = useState(false);
    const [botField, setBotField] = useState('');
    const [errors, setErrors] = useState<Errors<'email' | 'consent' | 'form'>>({});
    const [processing, setProcessing] = useState(false);
    const [sent, setSent] = useState(false);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        const found: typeof errors = {};
        if (!isEmail(email)) found.email = 'Introduce un email válido.';
        if (!consent) found.consent = 'Debes aceptar para que podamos avisarte.';
        setErrors(found);
        if (Object.keys(found).length > 0) return;

        setProcessing(true);
        try {
            await submitNetlifyForm('lista-espera', {
                'bot-field': botField,
                email: email.trim(),
                servicio: serviceName,
                consentimiento: `Sí, ${new Date().toISOString()}`,
            });
            setSent(true);
        } catch {
            setErrors({ form: 'No hemos podido apuntarte. Inténtalo de nuevo en unos minutos.' });
        } finally {
            setProcessing(false);
        }
    };

    if (sent) {
        return (
            <p className="flex items-center gap-2 font-medium text-emerald-300" role="status">
                <CheckCircle2 className="size-5" /> Hecho. Te escribiremos en cuanto lancemos {serviceName.toLowerCase()}.
            </p>
        );
    }

    const id = `waitlist-${serviceName.toLowerCase()}`;

    return (
        <form onSubmit={submit} className="relative grid gap-3" noValidate>
            <div className="flex flex-col gap-2 sm:flex-row">
                <label htmlFor={id} className="sr-only">
                    Email
                </label>
                <input
                    id={id}
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                name="bot-field"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
                value={botField}
                onChange={(e) => setBotField(e.target.value)}
            />
            <label className="flex items-start gap-2.5 text-xs leading-snug text-white/70">
                <Checkbox className="mt-px border-white/40" checked={consent} onCheckedChange={(checked) => setConsent(checked === true)} />
                <span>
                    Acepto recibir un único email cuando el servicio esté disponible (
                    <a href="/privacidad" className="underline underline-offset-2">
                        privacidad
                    </a>
                    ).
                </span>
            </label>
            <InputError message={errors.consent} className="text-red-300" />
            <InputError message={errors.form} className="text-red-300" />
        </form>
    );
}
