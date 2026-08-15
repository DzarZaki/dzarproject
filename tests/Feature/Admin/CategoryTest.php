<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\User;
use App\Models\Work;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
            ->post('/admin/categories', ['nama' => 'Foto Produk'])
            ->assertRedirect(route('admin.categories.index'));

        $this->assertDatabaseHas('categories', [
            'nama' => 'Foto Produk',
            'slug' => 'foto-produk',
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
            ->put("/admin/categories/{$category->id}", ['nama' => 'Wedding'])
            ->assertRedirect(route('admin.categories.index'));

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'nama' => 'Wedding',
            'slug' => 'wedding',
        ]);
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