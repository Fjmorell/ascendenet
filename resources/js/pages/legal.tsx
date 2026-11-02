import SiteLayout from '@/layouts/site-layout';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface LegalData {
    company_name: string;
    tax_id: string;
    address: string;
    email: string;
}

type Page = 'aviso-legal' | 'privacidad' | 'cookies';

const titles: Record<Page, string> = {
    'aviso-legal': 'Aviso legal',
    privacidad: 'Política de privacidad',
    cookies: 'Política de cookies',
};

function H2({ children }: { children: ReactNode }) {
    return <h2 className="font-display mt-10 mb-3 text-xl font-bold text-slate-900">{children}</h2>;
}

function LegalNotice({ legal, siteUrl }: { legal: LegalData; siteUrl: string }) {
    return (
        <>
            <p>
                En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE),
                se informa de los datos del titular de este sitio web:
            </p>
            <ul>
                <li>Titular: {legal.company_name}</li>
                <li>NIF/CIF: {legal.tax_id}</li>
                <li>Domicilio: {legal.address}</li>
                <li>Email: {legal.email}</li>
                <li>Sitio web: {siteUrl}</li>
            </ul>
            <H2>Objeto</H2>
            <p>
                AscendeNet actúa como agente comercial independiente de servicios de telecomunicaciones. La información sobre tarifas tiene carácter
                informativo; las condiciones definitivas son las del operador y se confirman al cliente antes de la contratación.
            </p>
            <H2>Propiedad intelectual</H2>
            <p>
                Los contenidos de este sitio (textos, diseño, logotipos y código) son titularidad de {legal.company_name} o se usan con autorización.
                Las marcas de terceros mencionadas pertenecen a sus respectivos titulares.
            </p>
            <H2>Responsabilidad</H2>
            <p>
                El titular no se hace responsable de los daños derivados del uso de la información de este sitio ni de posibles interrupciones del
                servicio, y se reserva el derecho a modificar sus contenidos en cualquier momento.
            </p>
            <H2>Legislación aplicable</H2>
            <p>Este aviso legal se rige por la legislación española.</p>
        </>
    );
}

function Privacy({ legal }: { legal: LegalData }) {
    return (
        <>
            <H2>Responsable del tratamiento</H2>
            <p>
                {legal.company_name} (NIF/CIF {legal.tax_id}), con domicilio en {legal.address}. Contacto: {legal.email}.
            </p>
            <H2>Qué datos tratamos y para qué</H2>
            <ul>
                <li>
                    <strong>Solicitudes de llamada:</strong> nombre, teléfono, código postal, tarifa de interés y comentarios, para contactarte,
                    comprobar la cobertura y asesorarte sobre la contratación.
                </li>
                <li>
                    <strong>Avisos de lanzamiento:</strong> tu email, para enviarte un único aviso cuando el servicio que elegiste esté disponible.
                </li>
            </ul>
            <H2>Base legal</H2>
            <p>
                Tu consentimiento, que otorgas al marcar la casilla del formulario (art. 6.1.a RGPD), y la aplicación de medidas precontractuales a
                petición tuya (art. 6.1.b RGPD). Puedes retirar el consentimiento en cualquier momento.
            </p>
            <H2>Conservación</H2>
            <p>
                Conservamos los datos mientras gestionamos tu solicitud y, como máximo, 12 meses desde el último contacto si no llegas a contratar. Si
                contratas, durante los plazos legalmente exigibles.
            </p>
            <H2>Destinatarios</H2>
            <p>
                Si decides contratar, comunicaremos los datos necesarios al operador correspondiente para tramitar el alta. No cedemos datos a
                terceros con otros fines.
            </p>
            <H2>Tus derechos</H2>
            <p>
                Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a {legal.email}. Si
                consideras que no hemos atendido correctamente tu solicitud, puedes reclamar ante la Agencia Española de Protección de Datos
                (www.aepd.es).
            </p>
        </>
    );
}

function Cookies() {
    return (
        <>
            <p>
                Este sitio web solo utiliza cookies técnicas, imprescindibles para su funcionamiento. No usamos cookies de análisis ni publicitarias.
            </p>
            <div className="my-6 overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-900">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Cookie</th>
                            <th className="px-4 py-3 font-semibold">Finalidad</th>
                            <th className="px-4 py-3 font-semibold">Duración</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        <tr>
                            <td className="px-4 py-3 font-mono text-xs">ascendenet_session</td>
                            <td className="px-4 py-3">Mantener la sesión de navegación y el envío seguro de formularios.</td>
                            <td className="px-4 py-3">2 horas</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-mono text-xs">XSRF-TOKEN</td>
                            <td className="px-4 py-3">Protección frente a envíos fraudulentos de formularios.</td>
                            <td className="px-4 py-3">2 horas</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p>
                Al ser cookies estrictamente necesarias, están exentas del deber de consentimiento según el artículo 22.2 de la LSSI-CE. Puedes
                bloquearlas desde la configuración de tu navegador, aunque entonces los formularios podrían no funcionar.
            </p>
        </>
    );
}

export default function Legal({ page, legal, siteUrl }: { page: Page; legal: LegalData; siteUrl: string }) {
    return (
        <SiteLayout>
            <Head title={titles[page]} />
            <article className="mx-auto max-w-3xl px-4 py-16 text-[15px] leading-relaxed text-slate-700 sm:px-6 sm:py-20 [&_li]:mb-2 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5">
                <h1 className="font-display mb-8 text-4xl font-extrabold tracking-tight text-slate-900">{titles[page]}</h1>
                {page === 'aviso-legal' && <LegalNotice legal={legal} siteUrl={siteUrl} />}
                {page === 'privacidad' && <Privacy legal={legal} />}
                {page === 'cookies' && <Cookies />}
            </article>
        </SiteLayout>
    );
}
