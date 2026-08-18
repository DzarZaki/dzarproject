<?php

namespace App\Http\Controllers;

use App\Models\About;
use App\Models\Category;
use App\Models\Video;
use App\Models\Work;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        // 1. Slide show full screen
        $slides = Work::jenis(Work::JENIS_SLIDESHOW)
            ->with('fotoSlideshow')
            ->urut()
            ->get()
            ->filter(fn (Work $w) => $w->fotoSlideshow !== null)
            ->map(fn (Work $w) => [
                'id' => $w->id,
                'url' => $w->fotoSlideshow->url,
                'thumb' => $w->fotoSlideshow->thumb_url,
            ])
            ->values();

        // 2. Strip foto horizontal
        $horizontal = Work::jenis(Work::JENIS_HORIZONTAL)
            ->with(['fotoThumb', 'category'])
            ->urut()
            ->get()
            ->filter(fn (Work $w) => $w->fotoThumb !== null)
            ->map(fn (Work $w) => [
                'id' => $w->id,
                'judul' => $w->judul,
                'lokasi' => $w->lokasi,
                'kategori' => $w->category?->nama,
                'ukuran' => $w->ukuran ?? 'sedang',
                'url' => $w->fotoThumb->url,
                'thumb' => $w->fotoThumb->thumb_url,
                'link' => $w->slug ? route('works.show', $w->slug) : null,
            ])
            ->values();

        // 3. Carousel 3D kategori
        $kategori = Category::urut()
            ->withCount(['worksTampil as jumlah'])
            ->get()
            ->map(fn (Category $c) => [
                'id' => $c->id,
                'nama' => $c->nama,
                'slug' => $c->slug,
                'thumb_url' => $c->thumb_url,
                'jumlah' => $c->jumlah,
                'link' => route('works.index', ['kategori' => $c->slug]),
            ])
            ->values();

        // 4. Foto memanjang hitam putih, diatur dari form About
        $pita = About::singleton()->pita_url;

        // 5. Video
        $videos = Video::orderBy('urutan')->orderBy('id')->get()
            ->map(fn (Video $v) => [
                'id' => $v->id,
                'judul' => $v->judul,
                'embed_url' => $v->embed_url,
            ])
            ->filter(fn (array $v) => $v['embed_url'] !== null)
            ->values();

        return Inertia::render('Home', [
            'slides' => $slides,
            'horizontal' => $horizontal,
            'kategori' => $kategori,
            'pita' => $pita,
            'videos' => $videos,
        ]);
    }

    public function sitemap(): HttpResponse
    {
        $tautan = [
            route('home'),
            route('about'),
            route('works.index'),
            route('contact.index'),
        ];

        foreach (Work::whereNot('jenis', Work::JENIS_SLIDESHOW)->whereNotNull('slug')->pluck('slug') as $slug) {
            $tautan[] = route('works.show', $slug);
        }

        $isi = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
        $isi .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";

        foreach ($tautan as $url) {
            $isi .= '  <url><loc>'.e($url).'</loc></url>'."\n";
        }

        $isi .= '</urlset>';

        return response($isi, 200, ['Content-Type' => 'application/xml']);
    }
}