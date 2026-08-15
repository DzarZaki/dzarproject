<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Categories/Index', [
            'categories' => Category::withCount('works')->orderBy('nama')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Categories/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nama' => ['required', 'string', 'max:100', 'unique:categories,nama'],
        ], [
            'nama.required' => 'Nama kategori wajib diisi.',
            'nama.max' => 'Nama kategori maksimal 100 karakter.',
            'nama.unique' => 'Kategori ini sudah ada.',
        ]);

        Category::create([
            'nama' => $data['nama'],
            'slug' => Str::slug($data['nama']),
        ]);

        return redirect()->route('admin.categories.index');
    }

    public function edit(Category $category)
    {
        return Inertia::render('Admin/Categories/Edit', [
            'category' => $category,
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'nama' => ['required', 'string', 'max:100', 'unique:categories,nama,'.$category->id],
        ], [
            'nama.required' => 'Nama kategori wajib diisi.',
            'nama.max' => 'Nama kategori maksimal 100 karakter.',
            'nama.unique' => 'Kategori ini sudah ada.',
        ]);

        $category->update([
            'nama' => $data['nama'],
            'slug' => Str::slug($data['nama']),
        ]);

        return redirect()->route('admin.categories.index');
    }

    public function destroy(Category $category)
    {
        $jumlahWork = $category->works()->count();

        if ($jumlahWork > 0) {
            return back()->withErrors([
                'delete' => "Kategori \"{$category->nama}\" tidak dapat dihapus karena masih memiliki {$jumlahWork} work. Pindahkan atau hapus work tersebut terlebih dahulu.",
            ]);
        }

        $category->delete();

        return redirect()->route('admin.categories.index');
    }
}