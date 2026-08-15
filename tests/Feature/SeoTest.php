<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Work;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeoTest extends TestCase
{
    use RefreshDatabase;

    public function test_sitemap_menampilkan_halaman_statis_dan_semua_work(): void
    {
        $kategori = Category::create(['nama' => 'Wedding', 'slug' => 'wedding']);
        Work::create(['category_id' => $kategori->id, 'judul' => 'A & Z', 'slug' => 'a-z']);

        $response = $this->get('/sitemap.xml');

        $response->assertOk();
        $response->assertHeader('Content-Type', 'application/xml');
        $response->assertSee(url('/works/a-z'), false);
    }

    public function test_robots_txt_mengizinkan_publik_dan_melindungi_admin(): void
    {
        $isi = file_get_contents(public_path('robots.txt'));

        $this->assertStringContainsString('User-agent: *', $isi);
        $this->assertStringContainsString('Disallow: /admin', $isi);
        $this->assertStringContainsString('sitemap.xml', $isi);
    }
}