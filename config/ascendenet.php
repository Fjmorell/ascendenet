<?php

/*
|--------------------------------------------------------------------------
| AscendeNet business settings
|--------------------------------------------------------------------------
|
| Contact details shown on the public site and the address that receives
| new lead notifications. Legal details feed the aviso legal / privacidad
| pages and must be filled in before going to production.
|
*/

return [

    'leads_email' => env('LEADS_NOTIFY_EMAIL'),

    'contact' => [
        'phone' => env('CONTACT_PHONE'),
        'whatsapp' => env('CONTACT_WHATSAPP'), // international format without "+", e.g. 34600000000
        'email' => env('CONTACT_EMAIL'),
        'hours' => env('CONTACT_HOURS') ?: 'Lunes a viernes, de 9:00 a 20:00',
    ],

    'legal' => [
        'company_name' => env('LEGAL_COMPANY_NAME') ?: '[Razón social]',
        'tax_id' => env('LEGAL_TAX_ID') ?: '[NIF/CIF]',
        'address' => env('LEGAL_ADDRESS') ?: '[Domicilio social]',
        'email' => env('LEGAL_EMAIL') ?: env('CONTACT_EMAIL') ?: '[email de contacto]',
    ],

];
