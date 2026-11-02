<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'AscendeNet') }} — Fibra, móvil e internet para tu hogar</title>
        <meta name="description" content="Agentes independientes de telecomunicaciones: comparamos y contratamos por ti fibra, móvil e internet rural o 4G/5G. Te confirmamos cobertura en menos de 24 horas.">
        <meta name="theme-color" content="#0B2545">
        <link rel="canonical" href="{{ url()->current() }}">

        <meta property="og:type" content="website">
        <meta property="og:locale" content="es_ES">
        <meta property="og:site_name" content="AscendeNet">
        <meta property="og:title" content="AscendeNet — Fibra, móvil e internet para tu hogar">
        <meta property="og:description" content="Comparamos y contratamos por ti. Cobertura confirmada en menos de 24 h.">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:image" content="{{ asset('images/og-image.png') }}">
        <meta name="twitter:card" content="summary_large_image">

        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="icon" href="/favicon.ico" sizes="48x48">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
