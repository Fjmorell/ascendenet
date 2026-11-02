import './index.css';

import Home from '@/home';
import Legal, { type Page } from '@/legal';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const legalPages: Record<string, { page: Page; title: string }> = {
    '/aviso-legal': { page: 'aviso-legal', title: 'Aviso legal' },
    '/privacidad': { page: 'privacidad', title: 'Política de privacidad' },
    '/cookies': { page: 'cookies', title: 'Política de cookies' },
};

const path = window.location.pathname.replace(/\/+$/, '') || '/';
const legal = legalPages[path];

if (legal) {
    document.title = `${legal.title} — AscendeNet`;
}

createRoot(document.getElementById('root')!).render(<StrictMode>{legal ? <Legal page={legal.page} /> : <Home />}</StrictMode>);
