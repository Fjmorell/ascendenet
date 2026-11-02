import CallbackForm from '@/components/callback-form';
import SiteLayout from '@/components/site-layout';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatPrice, services, type Tariff } from '@/data/site';
import { cn } from '@/lib/utils';
import {
    ArrowRight,
    BadgeCheck,
    Check,
    ChevronDown,
    Clock,
    Handshake,
    type LucideIcon,
    MapPin,
    PhoneCall,
    Router,
    SatelliteDish,
    Scale,
    ShieldCheck,
    Smartphone,
    Zap,
} from 'lucide-react';
import { useState } from 'react';

const serviceIcons: Record<string, LucideIcon> = {
    fibra: Router,
    movil: Smartphone,
    'internet-rural': SatelliteDish,
    luz: Zap,
    alarma: ShieldCheck,
};

function Hero() {
    return (
        <section className="bg-brand-navy relative overflow-hidden text-white">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        'radial-gradient(60rem 30rem at 85% -10%, rgba(28,143,188,.45), transparent 60%), radial-gradient(40rem 26rem at -10% 110%, rgba(63,174,107,.30), transparent 60%)',
                }}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                    backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                    backgroundSize: '56px 56px',
                    maskImage: 'linear-gradient(to bottom, black, transparent 85%)',
                }}
            />

            <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:pt-20 lg:pb-28">
                <div>
                    <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm text-white/80">
                        <span className="bg-brand-lime size-2 rounded-full shadow-[0_0_0_4px_rgba(76,184,72,.25)]" />
                        Agentes independientes · Fibra y móvil
                    </p>
                    <h1 className="font-display text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                        Tu conexión, <span className="text-gradient-brand">sin complicaciones.</span>
                    </h1>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
                        Comparamos y contratamos por ti la fibra, el móvil o el internet que mejor encaja en tu casa. Tú solo eliges; del papeleo nos
                        encargamos nosotros.
                    </p>

                    <ul className="mt-8 grid gap-3 text-[15px] text-slate-200 sm:grid-cols-2">
                        {[
                            'Cobertura confirmada en menos de 24 h',
                            'Asesoramiento personal, sin call centers',
                            'Opciones donde no llega la fibra',
                            'Un único contacto para todo',
                        ].map((item) => (
                            <li key={item} className="flex items-start gap-2.5">
                                <Check className="text-brand-lime mt-0.5 size-5 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-10 flex flex-wrap gap-3">
                        <a
                            href="#tarifas"
                            className="text-brand-navy inline-flex h-12 items-center gap-2 rounded-lg bg-white px-6 font-semibold transition hover:bg-slate-100"
                        >
                            Ver tarifas <ArrowRight className="size-4" />
                        </a>
                        <a
                            href="#contacto"
                            className="inline-flex h-12 items-center gap-2 rounded-lg border border-white/25 px-6 font-semibold text-white transition hover:bg-white/10"
                        >
                            <PhoneCall className="size-4" /> Que me llamen
                        </a>
                    </div>
                </div>

                <div className="rounded-2xl bg-white p-6 text-slate-900 shadow-2xl shadow-black/30 sm:p-8">
                    <div className="mb-6 flex items-start gap-3">
                        <span className="bg-brand-mist text-brand-blue flex size-11 shrink-0 items-center justify-center rounded-xl">
                            <MapPin className="size-5" />
                        </span>
                        <div>
                            <h2 className="font-display text-xl font-bold">Comprueba tu cobertura</h2>
                            <p className="text-sm text-slate-500">Déjanos tus datos y te llamamos con las opciones disponibles en tu zona.</p>
                        </div>
                    </div>
                    <CallbackForm source="hero" compact />
                </div>
            </div>

            <div className="relative border-t border-white/10 bg-black/10">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-4 py-5 text-sm text-white/70 sm:px-6">
                    <span className="font-medium text-white/50">Servicios:</span>
                    {services.map((service) => {
                        const Icon = serviceIcons[service.slug] ?? Router;
                        return (
                            <a
                                key={service.slug}
                                href={service.status === 'active' ? '#tarifas' : '#contacto'}
                                className="flex items-center gap-2 hover:text-white"
                            >
                                <Icon className="size-4" />
                                {service.name}
                                {service.status === 'soon' && (
                                    <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-[11px] font-semibold text-amber-300 uppercase">
                                        Pronto
                                    </span>
                                )}
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function Benefits() {
    const items: { icon: LucideIcon; title: string; text: string }[] = [
        { icon: Scale, title: 'Comparamos por ti', text: 'Analizamos tu caso y te proponemos la opción que de verdad te conviene.' },
        { icon: MapPin, title: 'Cobertura real', text: 'Verificamos tu dirección antes de contratar. Sin sorpresas el día de la instalación.' },
        { icon: Handshake, title: 'Te acompañamos', text: 'Tramitamos el alta y la portabilidad, y seguimos ahí si necesitas algo después.' },
        { icon: Clock, title: 'Horario amplio', text: 'Te llamamos de lunes a viernes de 9:00 a 20:00, cuando mejor te venga.' },
    ];

    return (
        <section className="border-b border-slate-200 bg-slate-50">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
                {items.map(({ icon: Icon, title, text }) => (
                    <div key={title}>
                        <span className="text-brand-blue mb-4 flex size-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                            <Icon className="size-5" />
                        </span>
                        <h3 className="font-display text-lg font-bold">{title}</h3>
                        <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600">{text}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function SectionHeading({
    eyebrow,
    title,
    children,
    center = false,
}: {
    eyebrow: string;
    title: string;
    children?: React.ReactNode;
    center?: boolean;
}) {
    return (
        <div className={cn('mb-12 max-w-2xl', center && 'mx-auto text-center')}>
            <p className="text-brand-sky mb-3 text-sm font-semibold tracking-wider uppercase">{eyebrow}</p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">{title}</h2>
            {children && <p className="mt-4 text-lg leading-relaxed text-slate-600">{children}</p>}
        </div>
    );
}

function TariffCard({ tariff, onChoose }: { tariff: Tariff; onChoose: (tariff: Tariff) => void }) {
    const price = tariff.price ? formatPrice(tariff.price) : null;

    return (
        <article
            className={cn(
                'relative flex flex-col rounded-2xl border bg-white p-7 transition hover:-translate-y-0.5 hover:shadow-lg',
                tariff.featured ? 'border-brand-sky shadow-brand-sky/10 ring-brand-sky shadow-xl ring-1' : 'border-slate-200',
            )}
        >
            {tariff.badge && (
                <span
                    className={cn(
                        'absolute -top-3 left-7 rounded-full px-3 py-1 text-xs font-semibold',
                        tariff.featured ? 'from-brand-blue to-brand-green bg-gradient-to-r text-white' : 'bg-slate-900 text-white',
                    )}
                >
                    {tariff.badge}
                </span>
            )}
            {tariff.provider && <p className="text-sm font-medium text-slate-500">{tariff.provider}</p>}
            <h3 className="font-display mt-1 text-xl font-bold">{tariff.name}</h3>

            <div className="mt-6 mb-6 flex items-baseline gap-1">
                {price ? (
                    <>
                        <span className="font-display">
                            <span className="text-5xl font-extrabold tracking-tight">{price.whole}</span>
                            <span className="text-2xl font-bold">,{price.cents}</span>
                        </span>
                        <span className="ml-1 text-slate-500">€/mes</span>
                    </>
                ) : (
                    <span className="font-display text-2xl font-bold text-slate-700">{tariff.priceLabel ?? 'Consúltanos'}</span>
                )}
            </div>

            <ul className="mb-8 space-y-3 text-[15px] text-slate-700">
                {tariff.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                        <Check className="text-brand-green mt-0.5 size-5 shrink-0" />
                        {feature}
                    </li>
                ))}
            </ul>

            <button
                type="button"
                onClick={() => onChoose(tariff)}
                className={cn(
                    'mt-auto inline-flex h-12 items-center justify-center gap-2 rounded-lg font-semibold transition',
                    tariff.featured ? 'bg-brand-navy hover:bg-brand-blue text-white' : 'bg-slate-100 text-slate-900 hover:bg-slate-200',
                )}
            >
                {price ? 'Quiero esta tarifa' : 'Consultar disponibilidad'}
            </button>
        </article>
    );
}

function Tariffs() {
    const sellable = services.filter((s) => s.status === 'active' && s.tariffs.length > 0);
    const [activeSlug, setActiveSlug] = useState(sellable[0]?.slug);
    const [chosen, setChosen] = useState<Tariff | null>(null);
    const current = sellable.find((s) => s.slug === activeSlug) ?? sellable[0];

    if (!current) {
        return null;
    }

    return (
        <section id="tarifas" className="py-20 sm:py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <SectionHeading eyebrow="Tarifas" title="Elige lo que necesitas" center>
                    Precios claros por mes. Antes de contratar te confirmamos cobertura, condiciones y promociones vigentes.
                </SectionHeading>

                <div
                    role="tablist"
                    aria-label="Tipo de servicio"
                    className="mx-auto mb-12 flex w-fit max-w-full gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1.5"
                >
                    {sellable.map((service) => {
                        const Icon = serviceIcons[service.slug] ?? Router;
                        const selected = service.slug === current.slug;
                        return (
                            <button
                                key={service.slug}
                                role="tab"
                                aria-selected={selected}
                                onClick={() => setActiveSlug(service.slug)}
                                className={cn(
                                    'flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition sm:px-5',
                                    selected ? 'text-brand-navy bg-white shadow-sm' : 'text-slate-500 hover:text-slate-800',
                                )}
                            >
                                <Icon className="size-4" />
                                {service.name}
                            </button>
                        );
                    })}
                </div>

                <div role="tabpanel">
                    {current.description && <p className="mx-auto mb-10 max-w-2xl text-center text-slate-600">{current.description}</p>}
                    <div
                        className={cn(
                            'mx-auto grid gap-6 pt-3',
                            current.tariffs.length === 1
                                ? 'max-w-sm'
                                : current.tariffs.length === 2
                                  ? 'max-w-3xl md:grid-cols-2'
                                  : 'md:grid-cols-2 lg:grid-cols-3',
                        )}
                    >
                        {current.tariffs.map((tariff) => (
                            <TariffCard key={tariff.id} tariff={tariff} onChoose={setChosen} />
                        ))}
                    </div>
                </div>

                <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-slate-500">
                    Precios según la oferta vigente del operador en el momento de publicación. Las condiciones finales (permanencia, promociones y
                    disponibilidad) se confirman antes de la contratación.
                </p>
            </div>

            <Dialog open={chosen !== null} onOpenChange={(open) => !open && setChosen(null)}>
                <DialogContent className="max-h-[92svh] overflow-y-auto bg-white text-slate-900 sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="font-display text-2xl">{chosen?.name}</DialogTitle>
                        <DialogDescription className="text-slate-500">
                            Déjanos tu teléfono y un agente te llama para confirmar cobertura y tramitar el alta.
                        </DialogDescription>
                    </DialogHeader>
                    {chosen && <CallbackForm key={chosen.id} defaultTariffId={chosen.id} source="tariff-card" compact />}
                </DialogContent>
            </Dialog>
        </section>
    );
}

function HowItWorks() {
    const steps = [
        { title: 'Cuéntanos qué necesitas', text: 'Rellena el formulario o llámanos. Nos dices dónde vives y qué uso le das a internet y al móvil.' },
        {
            title: 'Comprobamos y comparamos',
            text: 'Verificamos la cobertura en tu dirección y te explicamos las opciones, sin tecnicismos ni letra pequeña.',
        },
        {
            title: 'Tramitamos el alta',
            text: 'Nos encargamos de todo el proceso, incluida la portabilidad de tus números, hasta que estés conectado.',
        },
    ];

    return (
        <section id="como-funciona" className="bg-slate-50 py-20 sm:py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <SectionHeading eyebrow="Cómo funciona" title="Contratar con nosotros es fácil" />
                <ol className="grid gap-6 md:grid-cols-3">
                    {steps.map((step, index) => (
                        <li key={step.title} className="relative rounded-2xl border border-slate-200 bg-white p-7">
                            <span className="font-display from-brand-blue to-brand-green mb-5 flex size-11 items-center justify-center rounded-full bg-gradient-to-br text-lg font-extrabold text-white">
                                {index + 1}
                            </span>
                            <h3 className="font-display text-lg font-bold">{step.title}</h3>
                            <p className="mt-2 leading-relaxed text-slate-600">{step.text}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}

function Faq() {
    const faqs = [
        {
            q: '¿Qué es AscendeNet?',
            a: 'Somos agentes independientes. Te asesoramos sobre las tarifas disponibles en tu zona y tramitamos la contratación con el operador en tu nombre, para que no tengas que pelearte con operadores telefónicos.',
        },
        {
            q: '¿Cómo sé si tengo cobertura de fibra?',
            a: 'Déjanos tu código postal y tu teléfono. Comprobamos la cobertura exacta en tu dirección y te llamamos en menos de 24 horas laborables con las opciones disponibles.',
        },
        {
            q: '¿Qué pasa si en mi casa no llega la fibra?',
            a: 'Tenemos alternativas: internet 4G/5G, internet rural por radioenlace e internet por satélite. Estudiamos tu ubicación y te recomendamos la que mejor funcionará.',
        },
        {
            q: '¿Puedo conservar mi número de móvil?',
            a: 'Sí. Gestionamos la portabilidad de tus líneas para que mantengas tus números al cambiar de compañía.',
        },
        {
            q: '¿Cuándo tendréis luz y alarma?',
            a: 'Estamos cerrando acuerdos para ofrecerlas muy pronto. Si te interesan, déjanos tus datos en el formulario de contacto y te avisaremos en cuanto estén disponibles.',
        },
    ];

    return (
        <section id="preguntas" className="py-20 sm:py-24">
            <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr]">
                <SectionHeading eyebrow="Preguntas frecuentes" title="Resolvemos tus dudas">
                    ¿No encuentras lo que buscas? Escríbenos y te respondemos personalmente.
                </SectionHeading>
                <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
                    {faqs.map((faq) => (
                        <details key={faq.q} className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
                            <summary className="font-display flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
                                {faq.q}
                                <ChevronDown className="size-5 shrink-0 text-slate-400 transition group-open:rotate-180" />
                            </summary>
                            <p className="mt-3 leading-relaxed text-slate-600">{faq.a}</p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Contact() {
    return (
        <section id="contacto" className="bg-slate-50 py-20 sm:py-24">
            <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.3fr]">
                <div>
                    <SectionHeading eyebrow="Contacto" title="¿Hablamos?">
                        Cuéntanos qué necesitas y un agente te llama para confirmar cobertura y explicarte las opciones, sin compromiso.
                    </SectionHeading>
                    <ul className="space-y-4 text-slate-700">
                        {[
                            'Respuesta en menos de 24 h laborables',
                            'Sin compromiso de contratación',
                            'Tus datos solo se usan para atender tu solicitud',
                        ].map((item) => (
                            <li key={item} className="flex items-center gap-3">
                                <BadgeCheck className="text-brand-green size-5 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
                    <CallbackForm source="contact" />
                </div>
            </div>
        </section>
    );
}

export default function Home() {
    return (
        <SiteLayout>
            <Hero />
            <Benefits />
            <Tariffs />
            <HowItWorks />
            <Faq />
            <Contact />
        </SiteLayout>
    );
}
