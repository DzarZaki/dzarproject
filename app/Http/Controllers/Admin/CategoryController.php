<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Work;
use App\Services\PhotoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function __construct(private readonly PhotoService $foto) {}

    public function index(): Response
    {
        $categories = Category::urut()
            ->withCount(['worksTampil as jumlah_work'])
            ->get()
            ->map(fn (Category $c) => [
                'id' => $c->id,
                'nama' => $c->nama,
                'slug' => $c->slug,
                'urutan' => $c->urutan,
                'thumb_url' => $c->thumb_url,
                'jumlah_work' => $c->jumlah_work,
            ])
            ->values();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Categories/Create', [
            'urutanBerikutnya' => (int) Category::max('urutan') + 1,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validasi($request, null, wajibFoto: true);

        $category = Category::create([
            'nama' => $data['nama'],
            'slug' => $this->slugUnik($data['nama']),
            'urutan' => $data['urutan'] ?? 0,
        ]);

        $paths = $this->foto->simpanKeFolder($request->file('thumb'), 'categories', 1800, 900);
        $category->update(['thumb_path' => $paths['thumb_path']]);

        return redirect()->route('admin.categories.index')->with('sukses', 'Kategori ditambahkan.');
    }

    public function edit(Category $category): Response
    {
        return Inertia::render('Admin/Categories/Edit', [
            'category' => [
                'id' => $category->id,
                'nama' => $category->nama,
                'urutan' => $category->urutan,
                'thumb_url' => $category->thumb_url,
            ],
        ]);
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $data = $this->validasi($request, $category->id, wajibFoto: false);

        $category->update([
            'nama' => $data['nama'],
            'urutan' => $data['urutan'] ?? $category->urutan,
        ]);

        if ($request->hasFile('thumb')) {
            $this->foto->hapusFile($category->thumb_path);
            $paths = $this->foto->simpanKeFolder($request->file('thumb'), 'categories', 1800, 900);
            $category->update(['thumb_path' => $paths['thumb_path']]);
        }

        return redirect()->route('admin.categories.index')->with('sukses', 'Kategori diperbarui.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $terpakai = Work::where('category_id', $category->id)->count();

        if ($terpakai > 0) {
            return back()->with('galat', "Kategori masih dipakai {$terpakai} data. Pindahkan dulu kategorinya sebelum menghapus.");
        }

        $this->foto->hapusFile($category->thumb_path);
        $category->delete();

        return redirect()->route('admin.categories.index')->with('sukses', 'Kategori dihapus.');
    }

    /* ----------------------------------------------------------- */

    private function validasi(Request $request, ?int $abaikanId, bool $wajibFoto): array
    {
        return $request->validate([
            'nama' => [
                'required', 'string', 'max:80',
                Rule::unique('categories', 'nama')->ignore($abaikanId),
            ],
            'urutan' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'thumb' => [
                $wajibFoto ? 'required' : 'nullable',
                'image', 'mimes:jpg,jpeg,png,webp', 'max:12288',
            ],
        ], [
            'nama.required' => 'Nama kategori wajib diisi.',
            'nama.unique' => 'Nama kategori itu sudah ada.',
            'thumb.required' => 'Foto kartu kategori wajib diunggah.',
            'thumb.image' => 'File harus berupa gambar.',
            'thumb.max' => 'Ukuran gambar maksimal 12 MB.',
        ]);
    }

    private function slugUnik(string $nama, ?int $abaikanId = null): string
    {
        $dasar = Str::slug($nama) ?: 'kategori';
        $slug = $dasar;
        $nomor = 2;

        while (
            Category::where('slug', $slug)
                ->when($abaikanId, fn ($q) => $q->whereKeyNot($abaikanId))
                ->exists()
        ) {
            $slug = $dasar.'-'.$nomor;
            $nomor++;
        }

        return $slug;
    }
}