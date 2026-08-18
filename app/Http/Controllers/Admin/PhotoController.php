<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Photo;
use App\Models\Work;
use App\Services\PhotoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;

class PhotoController extends Controller
{
    /**
     * Regex link YouTube. Sengaja tidak ditulis sebagai URL utuh
     * supaya aman dari perusakan tanda kutip/kurung.
     */
    private const REGEX_YOUTUBE = '#(?:youtube\.com/(?:watch\?.*v=|shorts/|embed/|live/)|youtu\.be/)[a-zA-Z0-9_-]{11}#';

    public function __construct(private readonly PhotoService $foto) {}

    public function edit(Work $work): Response
    {
        abort_unless($work->punyaDetail(), 404, 'Slide show tidak punya halaman detail.');

        $work->load(['fotoCover', 'fotoZigzag', 'category']);

        return Inertia::render('Admin/Works/Detail', [
            'work' => [
                'id' => $work->id,
                'jenis' => $work->jenis,
                'judul' => $work->judul,
                'lokasi' => $work->lokasi,
                'category_id' => $work->category_id,
                'deskripsi' => $work->deskripsi,
                'youtube_url' => $work->youtube_url,
                'cover' => $work->fotoCover ? [
                    'id' => $work->fotoCover->id,
                    'thumb' => $work->fotoCover->thumb_url,
                ] : null,
                'zigzag' => $work->fotoZigzag->map(fn (Photo $f) => [
                    'id' => $f->id,
                    'thumb' => $f->thumb_url,
                    'urutan' => $f->urutan,
                ])->values(),
            ],
            'categories' => Category::urut()->get(['id', 'nama'])->map(fn ($c) => [
                'id' => $c->id,
                'nama' => $c->nama,
            ])->values(),
        ]);
    }

    public function update(Request $request, Work $work): RedirectResponse
    {
        abort_unless($work->punyaDetail(), 404);

        $data = $request->validate([
            'judul' => ['required', 'string', 'max:150'],
            'lokasi' => ['required', 'string', 'max:150'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'deskripsi' => ['nullable', 'string', 'max:5000'],
            'youtube_url' => ['nullable', 'string', 'max:255', 'regex:'.self::REGEX_YOUTUBE],
            'cover' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:12288'],
        ], [
            'judul.required' => 'Judul wajib diisi.',
            'lokasi.required' => 'Lokasi wajib diisi.',
            'category_id.exists' => 'Kategori tidak ditemukan.',
            'youtube_url.regex' => 'Link YouTube tidak dikenali. Tempel link watch, youtu.be, atau shorts.',
            'cover.image' => 'Cover harus berupa gambar.',
            'cover.max' => 'Ukuran cover maksimal 12 MB.',
        ]);

        $work->update([
            'judul' => $data['judul'],
            'lokasi' => $data['lokasi'],
            'category_id' => $data['category_id'] ?? null,
            'deskripsi' => $data['deskripsi'] ?? null,
            'youtube_url' => $data['youtube_url'] ?? null,
        ]);

        if ($request->hasFile('cover')) {
            $this->foto->simpanDariUpload($request->file('cover'), $work, Photo::COVER);
        }

        return back()->with('sukses', 'Halaman detail disimpan.');
    }

    public function tambahZigzag(Request $request, Work $work): RedirectResponse
    {
        abort_unless($work->punyaDetail(), 404);

        $request->validate([
            'foto' => ['required', 'array', 'min:1', 'max:20'],
            'foto.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:12288'],
        ], [
            'foto.required' => 'Pilih minimal satu foto.',
            'foto.max' => 'Maksimal 20 foto per sekali unggah. Ulangi untuk sisanya.',
            'foto.*.image' => 'Semua file harus berupa gambar.',
            'foto.*.mimes' => 'Format gambar harus JPG, PNG, atau WebP.',
            'foto.*.max' => 'Ukuran tiap gambar maksimal 12 MB.',
        ]);

        foreach ($request->file('foto') as $file) {
            $this->foto->simpanDariUpload($file, $work, Photo::ZIGZAG);
        }

        return back()->with('sukses', 'Foto zigzag ditambahkan.');
    }

    public function tambahZigzagDrive(Request $request, Work $work): RedirectResponse
    {
        abort_unless($work->punyaDetail(), 404);

        $data = $request->validate([
            'link' => ['required', 'string', 'max:500'],
        ], [
            'link.required' => 'Tempel link Google Drive lebih dulu.',
        ]);

        try {
            $this->foto->simpanDariLinkDrive($data['link'], $work, Photo::ZIGZAG);
        } catch (RuntimeException $e) {
            return back()->with('galat', $e->getMessage());
        }

        return back()->with('sukses', 'Foto dari Google Drive ditambahkan.');
    }

    public function urutkanZigzag(Request $request, Work $work): RedirectResponse
    {
        abort_unless($work->punyaDetail(), 404);

        $data = $request->validate([
            'urutan' => ['required', 'array', 'min:1'],
            'urutan.*' => ['integer'],
        ]);

        $this->foto->urutkanUlang($work, $data['urutan']);

        return back()->with('sukses', 'Urutan foto zigzag diperbarui.');
    }

    public function destroy(Photo $photo): RedirectResponse
    {
        $this->foto->hapus($photo);

        return back()->with('sukses', 'Foto dihapus.');
    }
}