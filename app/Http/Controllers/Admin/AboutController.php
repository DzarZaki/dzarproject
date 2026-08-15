<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\About;
use App\Models\AboutPhoto;
use App\Services\PhotoService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AboutController extends Controller
{
    public function __construct(private PhotoService $photos) {}

    public function edit()
    {
        return Inertia::render('Admin/About/Edit', [
            'about' => About::singleton(),
            'fotos' => AboutPhoto::orderBy('urutan')->get(),
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'judul' => ['required', 'string', 'max:150'],
            'teks' => ['required', 'string', 'max:2000'],
            'foto' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:10240'],
        ], [
            'judul.required' => 'Judul wajib diisi.',
            'judul.max' => 'Judul maksimal 150 karakter.',
            'teks.required' => 'Teks tentang wajib diisi.',
            'teks.max' => 'Teks maksimal 2000 karakter.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.mimes' => 'Format yang didukung: JPG, PNG, WebP.',
            'foto.max' => 'Ukuran foto maksimal 10 MB.',
        ]);

        $about = About::singleton();
        $about->judul = $data['judul'];
        $about->teks = $data['teks'];

        // Ganti foto portrait? Hapus file lama, simpan yang baru.
        if ($request->hasFile('foto')) {
            $this->photos->hapusFile($about->foto_path);
            $paths = $this->photos->prosesFile($request->file('foto')->getRealPath(), 'about');
            $about->foto_path = $paths['file_path'];
        }

        $about->save();

        return back();
    }

    public function storePhoto(Request $request)
    {
        $request->validate([
            'foto' => ['required', 'array', 'min:1', 'max:20'],
            'foto.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:10240'],
        ], [
            'foto.required' => 'Pilih minimal satu foto.',
            'foto.max' => 'Maksimal 20 foto sekali upload.',
            'foto.*.image' => 'File harus berupa gambar.',
            'foto.*.mimes' => 'Format yang didukung: JPG, PNG, WebP.',
            'foto.*.max' => 'Ukuran tiap foto maksimal 10 MB.',
        ]);

        $urutan = AboutPhoto::max('urutan') ?? 0;

        foreach ($request->file('foto') as $file) {
            $paths = $this->photos->prosesFile($file->getRealPath(), 'about');
            AboutPhoto::create([...$paths, 'urutan' => ++$urutan]);
        }

        return back();
    }

    public function updatePhoto(Request $request, AboutPhoto $aboutPhoto)
    {
        $data = $request->validate([
            'urutan' => ['required', 'integer', 'min:0'],
        ], [
            'urutan.required' => 'Urutan wajib diisi.',
            'urutan.integer' => 'Urutan harus berupa angka.',
        ]);

        $aboutPhoto->update($data);

        return back();
    }

    public function destroyPhoto(AboutPhoto $aboutPhoto)
    {
        $this->photos->hapusFile($aboutPhoto->file_path, $aboutPhoto->thumb_path);
        $aboutPhoto->delete();

        return back();
    }
}