<?php

namespace Tests\Feature\Admin;

use App\Models\About;
use App\Models\AboutPhoto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AboutTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create();
    }

    public function test_tamu_tidak_bisa_mengakses_halaman_about_admin(): void
    {
        $this->get('/admin/about')->assertRedirect('/login');
    }

    public function test_baris_about_terbuat_otomatis_sekali_saja(): void
    {
        $this->actingAs($this->admin())->get('/admin/about')->assertOk();
        $this->actingAs($this->admin())->get('/admin/about')->assertOk();

        $this->assertEquals(1, About::count()); // tetap satu baris
    }

    public function test_admin_bisa_menyimpan_konten_about(): void
    {
        $this->actingAs($this->admin())->put('/admin/about', [
            'judul' => 'Tentang DzarProject',
            'teks' => 'Kami adalah studio fotografi yang percaya pada momen jujur.',
        ])->assertRedirect();

        $this->assertDatabaseHas('abouts', ['judul' => 'Tentang DzarProject']);
    }

    public function test_admin_bisa_mengganti_foto_portrait(): void
    {
        Storage::fake('public');

        $this->actingAs($this->admin())->put('/admin/about', [
            'judul' => 'Tentang',
            'teks' => 'Teks singkat.',
            'foto' => UploadedFile::fake()->image('portrait.jpg', 600, 800),
        ])->assertRedirect();

        $about = About::first();
        $this->assertNotNull($about->foto_path);
        $this->assertStringEndsWith('.webp', $about->foto_path);
        Storage::disk('public')->assertExists($about->foto_path);
    }

    public function test_admin_bisa_upload_dan_hapus_foto_galeri(): void
    {
        Storage::fake('public');

        $this->actingAs($this->admin())->post('/admin/about/photos', [
            'foto' => [UploadedFile::fake()->image('g1.jpg')],
        ])->assertRedirect();

        $foto = AboutPhoto::first();
        $this->assertNotNull($foto);
        Storage::disk('public')->assertExists($foto->file_path);

        $this->actingAs($this->admin())->delete("/admin/about/photos/{$foto->id}")->assertRedirect();
        $this->assertDatabaseMissing('about_photos', ['id' => $foto->id]);
        Storage::disk('public')->assertMissing($foto->file_path);
    }

    public function test_halaman_about_publik_menampilkan_konten(): void
    {
        About::create(['judul' => 'Tentang Kami', 'teks' => 'Studio fotografi editorial.']);

        $this->get('/about')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('About')
                ->where('about.judul', 'Tentang Kami')
            );
    }
}
