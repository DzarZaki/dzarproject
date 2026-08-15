<?php

namespace App\Http\Controllers;

use App\Models\Video;
use App\Models\Work;
use Inertia\Inertia;
use App\Models\About;
use App\Models\AboutPhoto;

class HomeController extends Controller
{
    public function index()
    {
        $works = Work::where('show_on_landing', true)
            ->with(['photos' => fn ($q) => $q->orderBy('urutan')])
            ->orderBy('urutan')
            ->get();

        $hero = [];
        $tipografi = [];
        $strip = [];

        foreach ($works as $work) {
            foreach ($work->photos as $photo) {
                $foto = [
                    'id' => $photo->id,
                    'url' => '/storage/'.$photo->file_path,
                    'work_judul' => $work->judul,
                    'work_slug' => $work->slug,
                ];

                match ($photo->peran) {
                    'cover' => $hero[] = $foto,
                    'landing_typography' => $tipografi[] = $foto,
                    'landing_strip' => $strip[] = $foto,
                    default => null,
                };
            }
        }

        return Inertia::render('Home', [
            'heroPhotos' => $hero,
            'tipografiPhotos' => $tipografi,
            'stripPhotos' => $strip,
            'videos' => Video::orderBy('urutan')->get(['id', 'judul', 'youtube_url', 'urutan']),
        ]);
    }

    public function about()
{
    $about = About::singleton();

    return Inertia::render('About', [
        'about' => [
            'judul' => $about->judul,
            'teks' => $about->teks,
            'foto_url' => $about->foto_path ? '/storage/'.$about->foto_path : null,
        ],
        'fotos' => AboutPhoto::orderBy('urutan')->get()
            ->map(fn ($p) => ['id' => $p->id, 'url' => '/storage/'.$p->file_path]),
    ]);
}
}