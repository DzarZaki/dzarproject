<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\User;
use App\Models\Work;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create();
    }

    public function test_tamu_tidak_bisa_mengakses_daftar_kategori(): void
    {
        $this->get('/admin/categories')->assertRedirect('/login');
    }

    public function test_admin_bisa_melihat_daftar_kategori(): void
    {
        Category::create(['nama' => 'Wedding', 'slug' => 'wedding']);

        $this->actingAs($this->admin())
            ->get('/admin/categories')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Categories/Index')
                ->has('categories', 1)
            );
    }

    public function test_admin_bisa_menambah_kategori_dan_slug_otomatis(): void
    {
        $this->actingAs($this->admin())
            ->post('/admin/categories', ['nama' => 'Foto Produk', 'urutan' => 2])
            ->assertRedirect(route('admin.categories.index'));

        $this->assertDatabaseHas('categories', [
            'nama' => 'Foto Produk',
            'slug' => 'foto-produk',
            'urutan' => 2,
        ]);
    }

    public function test_nama_kategori_wajib_diisi(): void
    {
        $this->actingAs($this->admin())
            ->post('/admin/categories', ['nama' => ''])
            ->assertSessionHasErrors('nama');
    }

    public function test_nama_kategori_tidak_boleh_duplikat(): void
    {
        Category::create(['nama' => 'Wedding', 'slug' => 'wedding']);

        $this->actingAs($this->admin())
            ->post('/admin/categories', ['nama' => 'Wedding'])
            ->assertSessionHasErrors('nama');
    }

    public function test_admin_bisa_mengubah_kategori(): void
    {
        $category = Category::create(['nama' => 'Weding', 'slug' => 'weding']);

        $this->actingAs($this->admin())
            ->put("/admin/categories/{$category->id}", ['nama' => 'Wedding', 'urutan' => 0])
            ->assertRedirect(route('admin.categories.index'));

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'nama' => 'Wedding',
            'slug' => 'wedding',
        ]);
    }

    public function test_admin_bisa_mengunggah_dan_menghapus_foto_kategori(): void
    {
        Storage::fake('public');
        $category = Category::create(['nama' => 'Wisuda', 'slug' => 'wisuda']);

        $this->actingAs($this->admin())
            ->post("/admin/categories/{$category->id}/foto", [
                'foto' => UploadedFile::fake()->image('kategori.jpg', 1600, 900),
            ])
            ->assertRedirect();

        $category->refresh();
        $this->assertNotNull($category->file_path);
        $this->assertStringEndsWith('.webp', $category->file_path);
        Storage::disk('public')->assertExists($category->file_path);

        $lama = $category->file_path;

        $this->actingAs($this->admin())
            ->delete("/admin/categories/{$category->id}/foto")
            ->assertRedirect();

        $this->assertNull($category->fresh()->file_path);
        Storage::disk('public')->assertMissing($lama);
    }

    public function test_kategori_tanpa_work_bisa_dihapus(): void
    {
        $category = Category::create(['nama' => 'Wisuda', 'slug' => 'wisuda']);

        $this->actingAs($this->admin())
            ->delete("/admin/categories/{$category->id}")
            ->assertRedirect(route('admin.categories.index'));

        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    public function test_kategori_yang_memiliki_work_tidak_bisa_dihapus(): void
    {
        $category = Category::create(['nama' => 'Wedding', 'slug' => 'wedding']);
        Work::create([
            'category_id' => $category->id,
            'judul' => 'A & Z',
            'slug' => 'a-z',
        ]);

        $this->actingAs($this->admin())
            ->delete("/admin/categories/{$category->id}")
            ->assertSessionHasErrors('delete');

        $this->assertDatabaseHas('categories', ['id' => $category->id]);
    }
}
