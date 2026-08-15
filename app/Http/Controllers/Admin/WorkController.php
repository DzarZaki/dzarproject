<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Work;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class WorkController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Works/Index', [
            'works' => Work::with('category:id,nama')
                ->withCount('photos')
                ->orderBy('urutan')
                ->orderByDesc('created_at')
                ->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Works/Create', [
            'categories' => Category::orderBy('nama')->get(['id', 'nama']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);

        Work::create([
            ...$data,
            'slug' => $this->buatSlugUnik($data['judul']),
        ]);

        return redirect()->route('admin.works.index');
    }

    public function edit(Work $work)
    {
        return Inertia::render('Admin/Works/Edit', [
            'work' => $work,
            'categories' => Category::orderBy('nama')->get(['id', 'nama']),
        ]);
    }

    public function update(Request $request, Work $work)
    {
        $data = $this->validated($request);

        $work->update([
            ...$data,
            'slug' => $this->buatSlugUnik($data['judul'], $work->id),
        ]);

        return redirect()->route('admin.works.index');
    }

    public function destroy(Work $work, \App\Services\PhotoService $photos)
{
    foreach ($work->photos as $photo) {
        $photos->hapus($photo); // hapus file fisik + baris tabel
    }

    $work->delete();

    return redirect()->route('admin.works.index');
}

    private function validated(Request $request): array
    {
        return $request->validate([
            'judul' => ['required', 'string', 'max:150'],
            'category_id' => ['required', 'exists:categories,id'],
            'deskripsi' => ['nullable', 'string', 'max:500'],
            'lokasi' => ['nullable', 'string', 'max:100'],
            'youtube_url' => ['nullable', 'url', 'max:255'],
            'show_on_landing' => ['boolean'],
            'urutan' => ['nullable', 'integer', 'min:0'],
        ], [
            'judul.required' => 'Judul work wajib diisi.',
            'judul.max' => 'Judul maksimal 150 karakter.',
            'category_id.required' => 'Kategori wajib dipilih.',
            'category_id.exists' => 'Kategori tidak ditemukan.',
            'deskripsi.max' => 'Deskripsi maksimal 500 karakter.',
            'lokasi.max' => 'Lokasi maksimal 100 karakter.',
            'youtube_url.url' => 'Format link YouTube tidak valid.',
            'urutan.integer' => 'Urutan harus berupa angka.',
        ]);
    }

    private function buatSlugUnik(string $judul, ?int $abaikanId = null): string
    {
        $slug = Str::slug($judul);
        $asli = $slug;
        $i = 1;

        while (
            Work::where('slug', $slug)
                ->when($abaikanId, fn ($q) => $q->where('id', '!=', $abaikanId))
                ->exists()
        ) {
            $slug = $asli.'-'.$i++;
        }

        return $slug;
    }
}