<?php

namespace App\Http\Controllers;

use App\Models\About;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function index(): Response
    {
        $about = About::singleton();

        return Inertia::render('About', [
            'about' => [
                'label' => $about->label,
                'judul' => $about->judul,
                'paragraf_1' => $about->paragraf_1,
                'paragraf_2' => $about->paragraf_2,
                'portrait_url' => $about->portrait_url,
                'full_url' => $about->full_url,
            ],
        ]);
    }
}