<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\User;
use App\Models\Work;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class WorkTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create();
    }

    private function kategori(): Category
    {
        return Category::create(['nama' => 'Wedding', 'slug' => 'wedding']);
    }

    public function test_tamu_tidak_bisa_mengakses_daftar_work(): void
    {
        $this->get('/admin/works')->assertRedirect('/login');
    }

    public function test_admin_bisa_melihat_daftar_work(): void
    {
        Work::create(['category_id' => $this->kategori()->id, 'judul' => 'A & Z', 'slug' => 'a-z']);

        $this->actingAs($this->admin())
            ->get('/admin/works')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Works/Index')
                ->has('works', 1)
            );
    }

    public function test_admin_bisa_menambah_work(): void
    {
        $kategori = $this->kategori();

        $this->actingAs($this->admin())->post('/admin/works', [
            'judul' => 'A & Z',
            'category_id' => $kategori->id,
            'lokasi' => 'Jakarta',
            'show_on_landing' => true,
        ])->assertRedirect(route('admin.works.index'));

        $this->assertDatabaseHas('works', [
            'judul' => 'A & Z',
            'slug' => 'a-z',
            'show_on_landing' => true,
        ]);
    }

    public function test_slug_tidak_tabrakan_saat_judul_sama(): void
    {
        $kategori = $this->kategori();
        Work::create(['category_id' => $kategori->id, 'judul' => 'A & Z', 'slug' => 'a-z']);

        $this->actingAs($this->admin())->post('/admin/works', [
            'judul' => 'A & Z',
            'category_id' => $kategori->id,
        ]);

        $this->assertDatabaseHas('works', ['slug' => 'a-z-1']);
    }

    public function test_validasi_judul_dan_kategori_wajib(): void
    {
        $this->actingAs($this->admin())
            ->post('/admin/works', ['judul' => '', 'category_id' => null])
            ->assertSessionHasErrors(['judul', 'category_id']);
    }

    public function test_admin_bisa_mengubah_work(): void
    {
        $kategori = $this->kategori();
        $work = Work::create(['category_id' => $kategori->id, 'judul' => 'A & Z', 'slug' => 'a-z']);

        $this->actingAs($this->admin())->put("/admin/works/{$work->id}", [
            'judul' => 'A & Z Wedding',
            'category_id' => $kategori->id,
            'show_on_landing' => false,
        ])->assertRedirect(route('admin.works.index'));

        $this->assertDatabaseHas('works', [
            'id' => $work->id,
            'judul' => 'A & Z Wedding',
            'slug' => 'a-z-wedding',
        ]);
    }

    public function test_hapus_work_ikut_menghapus_fotonya(): void
    {
        $kategori = $this->kategori();
        $work = Work::create(['category_id' => $kategori->id, 'judul' => 'A & Z', 'slug' => 'a-z']);
        $work->photos()->create(['file_path' => 'works/a-z/detail-01.webp', 'peran' => 'detail']);

        $this->actingAs($this->admin())
            ->delete("/admin/works/{$work->id}")
            ->assertRedirect(route('admin.works.index'));

        $this->assertDatabaseMissing('works', ['id' => $work->id]);
        $this->assertDatabaseMissing('photos', ['work_id' => $work->id]);
    }
}