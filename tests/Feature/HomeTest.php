<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Video;
use App\Models\Work;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class HomeTest extends TestCase
{
    use RefreshDatabase;

    public function test_landing_menampilkan_komponen_home(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Home'));
    }

    public function test_landing_mengirim_foto_sesuai_peran_dan_flag_landing(): void
    {
        $kategori = Category::create(['nama' => 'Wedding', 'slug' => 'wedding']);

        // Work yang TAMPIL di landing, dengan 3 peran foto
        $work = Work::create([
            'category_id' => $kategori->id,
            'judul' => 'A & Z',
            'slug' => 'a-z',
            'show_on_landing' => true,
        ]);
        $work->photos()->create(['file_path' => 'works/1/cover.webp', 'peran' => 'cover']);
        $work->photos()->create(['file_path' => 'works/1/strip.webp', 'peran' => 'landing_strip']);
        $work->photos()->create(['file_path' => 'works/1/detail.webp', 'peran' => 'detail']);

        // Work yang TIDAK tampil di landing — tidak boleh ikut
        $tersembunyi = Work::create([
            'category_id' => $kategori->id,
            'judul' => 'B & S',
            'slug' => 'b-s',
            'show_on_landing' => false,
        ]);
        $tersembunyi->photos()->create(['file_path' => 'works/2/cover.webp', 'peran' => 'cover']);

        Video::create(['judul' => 'Film', 'youtube_url' => 'https://youtu.be/dQw4w9WgXcQ']);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Home')
                ->has('heroPhotos', 1)      // hanya cover dari work show_on_landing
                ->has('stripPhotos', 1)
                ->has('tipografiPhotos', 0)
                ->has('videos', 1)
            );
    }
}