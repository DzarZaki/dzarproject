<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Work;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    public function index(Request $request)
    {
        $kategori = $request->query('kategori');

        $works = Work::with(['cover', 'category:id,nama,slug'])
            ->when($kategori, fn ($q) => $q->whereHas(
                'category', fn ($c) => $c->where('slug', $kategori)
            ))
            ->orderBy('urutan')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($work) => [
                'judul' => $work->judul,
                'slug' => $work->slug,
                'kategori' => $work->category->nama,
                'lokasi' => $work->lokasi,
                'cover' => $work->cover
                    ? '/storage/'.($work->cover->thumb_path ?? $work->cover->file_path)
                    : null,
            ]);

        return Inertia::render('Works/Index', [
            'works' => $works,
            'categories' => Category::has('works')->orderBy('nama')->get(['id', 'nama', 'slug']),
            'kategoriAktif' => $kategori,
        ]);
    }

    public function show(Work $work)
    {
        $work->load([
            'category:id,nama,slug',
            'photos' => fn ($q) => $q->where('peran', 'detail')->orderBy('urutan'),
        ]);

        // Navigasi prev/next mengikuti kolom urutan
        $semua = Work::orderBy('urutan')->orderBy('id')->get(['id', 'judul', 'slug']);
        $posisi = $semua->search(fn ($w) => $w->id === $work->id);

        return Inertia::render('Works/Show', [
            'work' => [
                'judul' => $work->judul,
                'kategori' => $work->category->nama,
                'lokasi' => $work->lokasi,
                'deskripsi' => $work->deskripsi,
                'cover_url' => $work->cover ? '/storage/'.$work->cover->file_path : null,
                'embed_url' => $work->embed_url,
                'fotos' => $work->photos
                    ->map(fn ($p) => ['id' => $p->id, 'url' => '/storage/'.$p->file_path])
                    ->values(),
            ],
            'sebelumnya' => $posisi > 0 ? $semua[$posisi - 1] : null,
            'berikutnya' => $posisi < $semua->count() - 1 ? $semua[$posisi + 1] : null,
        ]);
    }
}