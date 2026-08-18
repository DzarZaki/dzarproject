<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\About;
use App\Services\PhotoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function __construct(private readonly PhotoService $foto) {}

    public function edit(): Response
    {
        $about = About::singleton();

        return Inertia::render('Admin/About/Edit', [
            'about' => [
                'label' => $about->label,
                'judul' => $about->judul,
                'paragraf_1' => $about->paragraf_1,
                'paragraf_2' => $about->paragraf_2,
                'portrait_url' => $about->portrait_url,
                'full_url' => $about->full_url,
                'pita_url' => $about->pita_url,
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $about = About::singleton();

        $data = $request->validate([
            'label' => ['required', 'string', 'max:40'],
            'judul' => ['required', 'string', 'max:120'],
            'paragraf_1' => ['required', 'string', 'max:1500'],
            'paragraf_2' => ['nullable', 'string', 'max:1500'],
            'foto_portrait' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:12288'],
            'foto_full' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:12288'],
            'foto_pita' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:12288'],
        ], [
            'label.required' => 'Label kecil wajib diisi.',
            'judul.required' => 'Judul section wajib diisi.',
            'paragraf_1.required' => 'Paragraf pertama wajib diisi.',
            'foto_portrait.image' => 'Foto portrait harus berupa gambar.',
            'foto_full.image' => 'Foto lebar harus berupa gambar.',
            'foto_pita.image' => 'Foto memanjang landing page harus berupa gambar.',
            'foto_pita.mimes' => 'Foto memanjang landing page harus JPG, PNG, atau WebP.',
            'foto_pita.max' => 'Foto memanjang landing page maksimal 12 MB.',
        ]);

        $about->fill([
            'label' => $data['label'],
            'judul' => $data['judul'],
            'paragraf_1' => $data['paragraf_1'],
            'paragraf_2' => $data['paragraf_2'] ?? null,
        ]);

        if ($request->hasFile('foto_portrait')) {
            $this->foto->hapusFile($about->foto_portrait_path, $about->foto_portrait_thumb);
            $paths = $this->foto->simpanKeFolder($request->file('foto_portrait'), 'about', 1200, 600);
            $about->foto_portrait_path = $paths['file_path'];
            $about->foto_portrait_thumb = $paths['thumb_path'];
        }

        if ($request->hasFile('foto_full')) {
            $this->foto->hapusFile($about->foto_full_path, $about->foto_full_thumb);
            $paths = $this->foto->simpanKeFolder($request->file('foto_full'), 'about', 2600, 900);
            $about->foto_full_path = $paths['file_path'];
            $about->foto_full_thumb = $paths['thumb_path'];
        }

        if ($request->hasFile('foto_pita')) {
            $this->foto->hapusFile($about->foto_pita_path, $about->foto_pita_thumb);
            $paths = $this->foto->simpanKeFolder($request->file('foto_pita'), 'landing', 2800, 900);
            $about->foto_pita_path = $paths['file_path'];
            $about->foto_pita_thumb = $paths['thumb_path'];
        }

        $about->save();

        return back()->with('sukses', 'Halaman About disimpan.');
    }
}