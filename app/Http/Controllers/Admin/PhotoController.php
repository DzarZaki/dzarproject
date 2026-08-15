<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Photo;
use App\Models\Work;
use App\Services\PhotoService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PhotoController extends Controller
{
    public function __construct(private PhotoService $photos) {}

    public function index(Work $work)
    {
        return Inertia::render('Admin/Works/Photos', [
            'work' => $work->load('photos'),
        ]);
    }

    public function store(Request $request, Work $work)
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

        foreach ($request->file('foto') as $file) {
            $this->photos->simpanDariUpload($file, $work);
        }

        return back();
    }

    public function storeFromDrive(Request $request, Work $work)
    {
        $data = $request->validate([
            'gdrive_link' => ['required', 'url'],
        ], [
            'gdrive_link.required' => 'Link Google Drive wajib diisi.',
            'gdrive_link.url' => 'Format link tidak valid.',
        ]);

        try {
            $this->photos->simpanDariLinkDrive($data['gdrive_link'], $work);
        } catch (\RuntimeException $e) {
            return back()->withErrors(['gdrive_link' => $e->getMessage()]);
        }

        return back();
    }

    public function update(Request $request, Photo $photo)
    {
        $data = $request->validate([
            'peran' => ['required', 'in:cover,landing_typography,landing_strip,detail'],
            'urutan' => ['nullable', 'integer', 'min:0'],
        ], [
            'peran.required' => 'Peran foto wajib dipilih.',
            'peran.in' => 'Peran foto tidak valid.',
        ]);

        // Satu work hanya boleh punya SATU cover:
        // kalau foto ini dijadikan cover, cover lama turun menjadi detail.
        if ($data['peran'] === 'cover') {
            $photo->work->photos()
                ->where('id', '!=', $photo->id)
                ->where('peran', 'cover')
                ->update(['peran' => 'detail']);
        }

        $photo->update($data);

        return back();
    }

    public function destroy(Photo $photo)
    {
        $this->photos->hapus($photo);

        return back();
    }
}