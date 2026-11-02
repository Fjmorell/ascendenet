import { Wordmark } from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useForceLightTheme } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Mail, Menu, MessageCircle, Phone } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';

const navItems = [
    { label: 'Tarifas', href: '/#tarifas' },
    { label: 'Cómo funciona', href: '/#como-funciona' },
    { label: 'Próximamente', href: '/#proximamente' },
    { label: 'Preguntas', href: '/#preguntas' },
];

function Brand({ inverted = false }: { inverted?: boolean }) {
    return (
        <Link href={route('home')} className="flex items-center gap-2.5" aria-label="AscendeNet, inicio">
            <span className={cn('flex size-9 items-center justify-center rounded-lg', inverted ? 'bg-white' : 'bg-white ring-1 ring-slate-200')}>
                <AppLogoIcon className="size-8" />
            </span>
            <Wordmark className={cn('text-xl', inverted && '[&>span:first-child]:text-white')} />
        </Link>
    );
}

function SiteHeader() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className={cn(
                'sticky top-0 z-40 border-b bg-white/85 backdrop-blur-md transition-shadow',
                scrolled ? 'border-slate-200 shadow-sm' : 'border-transparent',
            )}
        >
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                <Brand />

                <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
                    {navItems.map((item) => (
                        <a key={item.href} href={item.href} className="text-[15px] font-medium text-slate-600 transition hover:text-slate-900">
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <a
                        href="/#contacto"
                        className="bg-brand-navy hover:bg-brand-blue hidden h-10 items-center rounded-lg px-4 text-sm font-semibold text-white transition sm:inline-flex"
                    >
                        Te llamamos
                    </a>
                    <Sheet>
                        <SheetTrigger className="inline-flex size-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden">
                            <Menu className="size-5" />
                            <span className="sr-only">Abrir menú</span>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-72 bg-white p-6 text-slate-900">
                            <SheetTitle className="sr-only">Menú</SheetTitle>
                            <nav className="mt-8 flex flex-col gap-1" aria-label="Móvil">
                                {[...navItems, { label: 'Contacto', href: '/#contacto' }].map((item) => (
                                    <a key={item.href} href={item.href} className="rounded-lg px-3 py-3 text-lg font-medium hover:bg-slate-100">
                                        {item.label}
                                    </a>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}

function SiteFooter() {
    const { contact } = usePage<SharedData>().props;

    return (
        <footer className="bg-brand-navy text-slate-300">
            <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
                <div className="space-y-4">
                    <Brand inverted />
                    <p className="max-w-sm text-sm leading-relaxed text-slate-400">
                        Agentes independientes de telecomunicaciones. Comparamos, te asesoramos y tramitamos el alta por ti.
                    </p>
                </div>
                <div>
                    <h2 className="mb-4 text-sm font-semibold tracking-wide text-white uppercase">Contacto</h2>
                    <ul className="space-y-3 text-sm">
                        {contact.phone && (
                            <li>
                                <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-white">
                                    <Phone className="size-4" /> {contact.phone}
                                </a>
                            </li>
                        )}
                        {contact.email && (
                            <li>
                                <a href={`mailto:${contact.email}`} className="flex items-center gap-2 hover:text-white">
                                    <Mail className="size-4" /> {contact.email}
                                </a>
                            </li>
                        )}
                        <li className="text-slate-400">{contact.hours}</li>
                    </ul>
                </div>
                <div>
                    <h2 className="mb-4 text-sm font-semibold tracking-wide text-white uppercase">Legal</h2>
                    <ul className="space-y-3 text-sm">
                        <li>
                            <Link href={route('legal', 'aviso-legal')} className="hover:text-white">
                                Aviso legal
                            </Link>
                        </li>
                        <li>
                            <Link href={route('legal', 'privacidad')} className="hover:text-white">
                                Política de privacidad
                            </Link>
                        </li>
                        <li>
                            <Link href={route('legal', 'cookies')} className="hover:text-white">
                                Política de cookies
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:justify-between sm:px-6">
                    <p>© {new Date().getFullYear()} AscendeNet. Todos los derechos reservados.</p>
                    <p>Orange es una marca registrada de sus respectivos titulares.</p>
                </div>
            </div>
        </footer>
    );
}

function WhatsAppButton() {
    const { contact } = usePage<SharedData>().props;

    if (!contact.whatsapp) {
        return null;
    }

    const text = encodeURIComponent('Hola, me gustaría información sobre vuestras tarifas.');

    return (
        <a
            href={`https://wa.me/${contact.whatsapp}?text=${text}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed right-5 bottom-5 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition hover:scale-105"
            aria-label="Escríbenos por WhatsApp"
        >
            <MessageCircle className="size-7" />
        </a>
    );
}

export default function SiteLayout({ children }: { children: ReactNode }) {
    useForceLightTheme();

    return (
        <div className="flex min-h-svh flex-col bg-white text-slate-900">
            <a
                href="#contenido"
                className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:p-2"
            >
                Saltar al contenido
            </a>
            <SiteHeader />
            <main id="contenido" className="flex-1">
                {children}
            </main>
            <SiteFooter />
            <WhatsAppButton />
        </div>
    );
}
