# AscendeNet — web estática para Netlify

Versión estática (React + Vite + Tailwind) de la web de AscendeNet. Los formularios usan **Netlify Forms**: no hace falta servidor ni base de datos.

## Editar contenido

Todo el contenido editable está en [`src/data/site.ts`](src/data/site.ts):

- **Tarifas y servicios:** precio, características, etiqueta («Más elegida»…) y si van destacadas.
- **Luz / alarma:** cambia `status: 'soon'` a `'active'` y añade tarifas cuando las lances.
- **Contacto:** teléfono, email y WhatsApp. Si dejas un campo vacío, no se muestra.
- **Datos legales:** razón social, NIF y domicilio. **Obligatorio antes de publicar.**

Guarda, haz commit y push: Netlify vuelve a desplegar solo.

## Desarrollo local

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
```

En local los formularios no envían nada (Netlify Forms solo funciona en el sitio desplegado).

## Publicar en Netlify

1. Sube esta carpeta a un repositorio de GitHub, GitLab o Bitbucket.
2. En Netlify: **Add new site → Import an existing project** y elige el repositorio. Si el repo contiene todo el proyecto, pon **Base directory** = `netlify-site`. El resto (`npm run build`, carpeta `dist`) lo lee de `netlify.toml`.
3. **Activa los formularios:** en el sitio, **Forms → Enable form detection**. Viene desactivado por defecto en sitios nuevos; sin este paso, los envíos se pierden. Después, vuelve a desplegar (**Deploys → Trigger deploy**).
4. **Recibe los leads por email:** **Site configuration → Notifications → Emails and webhooks → Form submission notifications → Add notification → Email notification**. Configura una por formulario (`contacto` y `lista-espera`).
5. **Dominio:** **Domain management → Add a domain** → `ascendenet.com` y sigue las instrucciones de DNS. El HTTPS es automático.

Alternativa sin Git: `npm run build` y arrastra la carpeta `dist` a <https://app.netlify.com/drop>. Así cada cambio requiere volver a subirla, y los formularios también necesitan el paso 3.

## Límites del plan gratuito

Netlify Forms incluye 100 envíos al mes en el plan gratuito. Los envíos se ven en **Forms** y se pueden exportar a CSV. Los marcados como spam (campo trampa o filtro de Netlify) van a una pestaña aparte.
