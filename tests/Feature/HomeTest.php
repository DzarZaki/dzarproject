<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Photo;
use App\Models\Video;
use App\Models\Work;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class HomeTest extends TestCase
{
    use RefreshDatabase;

    private function kategori(string $nama, string $slug, bool $denganFoto = true): Category
    {
        $category = new Category;
        $category->forceFill([
            'nama' => $nama,
            'slug' => $slug,
            'urutan' => 0,
            'file_path' => $denganFoto ? "categories/{$slug}.webp" : null,
            'thumb_path' => $denganFoto ? "categories/{$slug}_thumb.webp" : null,
        ])->save();

        return $category;
    }

    private function foto(Work $work, string $penempatan, array $extra = []): Photo
    {
        $photo = new Photo;
        $photo->forceFill(array_merge([
            'work_id' => $work->id,
            'file_path' => "works/{$work->id}/{$penempatan}-".uniqid().'.webp',
            'penempatan' => $penempatan,
            'urutan' => 0,
        ], $extra))->save();

        return $photo;
    }

    public function test_landing_menampilkan_komponen_home(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Home'));
    }

    public function test_landing_mengirim_foto_sesuai_penempatannya(): void
    {
        $kategori = $this->kategori('Wedding', 'wedding');

        $work = Work::create([
            'category_id' => $kategori->id,
            'judul' => 'A & Z',
            'slug' => 'a-z',
        ]);

        $this->foto($work, 'slideshow');
        $this->foto($work, 'tipografi');
        $this->foto($work, 'strip', ['ukuran' => 'besar', 'posisi' => 'atas']);
        $this->foto($work, 'cover');
        $this->foto($work, 'detail');

        Video::create(['judul' => 'Film', 'youtube_url' => 'https://youtu.be/dQw4w9WgXcQ']);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Home')
                ->has('slideshow', 1)
                ->has('tipografiPhotos', 1)
                ->has('stripPhotos', 1)
                ->has('kategori', 1)
                ->has('videos', 1)
            );
    }

    public function test_kategori_di_landing_membawa_link_ke_works_terfilter(): void
    {
        $kategori = $this->kategori('Wisuda', 'wisuda');
        Work::create(['category_id' => $kategori->id, 'judul' => 'B Wisuda', 'slug' => 'b-wisuda']);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('kategori', 1)
                ->where('kategori.0.nama', 'Wisuda')
                ->where('kategori.0.link', route('works.index', ['kategori' => 'wisuda']))
            );
    }

    public function test_landing_tetap_aman_saat_belum_ada_konten(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('slideshow', 0)
                ->has('kategori', 0)
                ->has('stripPhotos', 0)
                ->has('videos', 0)
            );
    }
}
