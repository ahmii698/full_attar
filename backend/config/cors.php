<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'admin/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        'http://attar.fusixtech.com',      // ✅ FRONTEND LIVE
        'https://attar.fusixtech.com',     // ✅ FRONTEND LIVE (HTTPS)
        'https://attarbackend.fusixtech.com', // ✅ BACKEND LIVE
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];