<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class LegalController extends Controller
{
    public function __invoke(string $page): Response
    {
        return Inertia::render('legal', [
            'page' => $page,
            'legal' => config('ascendenet.legal'),
            'siteUrl' => config('app.url'),
        ]);
    }
}
