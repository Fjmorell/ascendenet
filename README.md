# AscendeNet

Web de AscendeNet (agentes independientes de fibra, móvil e internet) con panel de gestión de leads y tarifas.

**Stack:** Laravel 12 · Inertia 2 · React 19 · TypeScript · Tailwind CSS 4

## Qué incluye

- **Web pública** (`/`): tarifas por servicio cargadas desde la base de datos, formulario «Te llamamos», listas de espera para servicios en preparación (luz, alarma), FAQ y páginas legales (`/aviso-legal`, `/privacidad`, `/cookies`).
- **Captación de leads**: validación de teléfono español, consentimiento RGPD, honeypot anti-spam y límite de envíos por IP (3/min, 20/día). Cada lead se guarda y, si `LEADS_NOTIFY_EMAIL` está configurado, se avisa por email.
- **Panel** (`/dashboard`, requiere login): resumen, gestión de leads (estado, notas, búsqueda y filtros) y edición de servicios y tarifas sin tocar código.
- Sin cookies de terceros: las fuentes se sirven desde el propio dominio, así que no hace falta banner de cookies.

## Puesta en marcha (local)

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed   # crea el catálogo inicial y, en local, admin@ascendenet.test / password
composer run dev             # servidor + Vite + cola
```

## Producción

1. Rellena en `.env` los datos de contacto y, **obligatoriamente**, los legales (`LEGAL_COMPANY_NAME`, `LEGAL_TAX_ID`, `LEGAL_ADDRESS`); si faltan, las páginas legales muestran marcadores como `[Razón social]`.
2. Configura el correo (`MAIL_*`) y `LEADS_NOTIFY_EMAIL`. Las notificaciones van por cola: ejecuta un worker (`php artisan queue:work`) con Supervisor o similar.
3. Despliega:

   ```bash
   composer install --no-dev --optimize-autoloader
   npm ci && npm run build
   php artisan migrate --force
   php artisan db:seed --class=CatalogSeeder --force   # solo la primera vez
   php artisan config:cache && php artisan route:cache
   ```

4. Crea el usuario administrador (el registro público está desactivado):

   ```bash
   php artisan app:create-admin tu@email.com --name="Tu nombre"
   ```

## Tests

```bash
php artisan test
```
