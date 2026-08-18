<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Photo;
use App\Models\Work;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PortfolioTest extends TestCase
{
    use RefreshDatabase;

    private function kategori(string $nama): Category
    {
        return Category::create(['nama' => $nama, 'slug' => Str::slug($nama)]);
    }

    private function foto(Work $work, string $penempatan, int $urutan = 0): Photo
    {
        $photo = new Photo;
        $photo->forceFill([
            'work_id' => $work->id,
            'file_path' => "works/{$work->id}/{$penempatan}-".uniqid().'.webp',
            'penempatan' => $penempatan,
            'urutan' => $urutan,
        ])->save();

        return $photo;
    }

    public function test_halaman_works_menampilkan_semua_work(): void
    {
        $kategori = $this->kategori('Wedding');
        Work::create(['category_id' => $kategori->id, 'judul' => 'A & Z', 'slug' => 'a-z']);
        Work::create(['category_id' => $kategori->id, 'judul' => 'B & S', 'slug' => 'b-s']);

        $this->get('/works')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Works/Index')
                ->has('works', 2)
                ->has('categories')
            );
    }

    public function test_halaman_works_bisa_difilter_per_kategori(): void
    {
        $wedding = $this->kategori('Wedding');
        $wisuda = $this->kategori('Wisuda');
        Work::create(['category_id' => $wedding->id, 'judul' => 'A & Z', 'slug' => 'a-z']);
        Work::create(['category_id' => $wisuda->id, 'judul' => 'B Wisuda', 'slug' => 'b-wisuda']);

        $this->get('/works?kategori=wisuda')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('works', 1)
                ->where('kategoriAktif', 'wisuda')
            );
    }

    public function test_detail_work_menampilkan_foto_detail_dan_embed_video(): void
    {
        $kategori = $this->kategori('Wedding');
        $work = Work::create([
            'category_id' => $kategori->id,
            'judul' => 'A & Z',
            'slug' => 'a-z',
            'youtube_url' => 'https://youtu.be/dQw4w9WgXcQ',
        ]);

        $this->foto($work, 'cover');
        $this->foto($work, 'detail', 1);
        $this->foto($work, 'detail', 2);
        $this->foto($work, 'slideshow'); // slot landing, tidak masuk galeri detail

        $this->get('/works/a-z')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Works/Show')
                ->where('work.judul', 'A & Z')
                ->has('work.fotos', 2)
                ->where('work.embed_url', 'https://www.youtube.com/embed/dQw4w9WgXcQ')
            );
    }

    public function test_navigasi_prev_next_antar_work(): void
    {
        $kategori = $this->kategori('Wedding');
        Work::create(['category_id' => $kategori->id, 'judul' => 'Pertama', 'slug' => 'pertama', 'urutan' => 1]);
        Work::create(['category_id' => $kategori->id, 'judul' => 'Kedua', 'slug' => 'kedua', 'urutan' => 2]);
        Work::create(['category_id' => $kategori->id, 'judul' => 'Ketiga', 'slug' => 'ketiga', 'urutan' => 3]);

        $this->get('/works/kedua')->assertInertia(fn (Assert $page) => $page
            ->where('sebelumnya.slug', 'pertama')
            ->where('berikutnya.slug', 'ketiga')
        );

        $this->get('/works/pertama')->assertInertia(fn (Assert $page) => $page
            ->where('sebelumnya', null)
            ->where('berikutnya.slug', 'kedua')
        );
    }

    public function test_slug_tidak_dikenal_menampilkan_404(): void
    {
        $this->get('/works/tidak-ada')->assertNotFound();
    }
}
