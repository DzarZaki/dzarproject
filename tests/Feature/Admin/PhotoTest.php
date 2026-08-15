<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\User;
use App\Models\Work;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PhotoTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create();
    }

    private function work(): Work
    {
        $kategori = Category::create(['nama' => 'Wedding', 'slug' => 'wedding']);

        return Work::create(['category_id' => $kategori->id, 'judul' => 'A & Z', 'slug' => 'a-z']);
    }

    public function test_tamu_tidak_bisa_mengakses_halaman_foto(): void
    {
        $work = $this->work();

        $this->get("/admin/works/{$work->id}/photos")->assertRedirect('/login');
    }

    public function test_upload_foto_otomatis_menjadi_webp_plus_thumbnail(): void
    {
        Storage::fake('public');
        $work = $this->work();

        $this->actingAs($this->admin())->post("/admin/works/{$work->id}/photos", [
            'foto' => [
                UploadedFile::fake()->image('satu.jpg', 1200, 800),
                UploadedFile::fake()->image('dua.png', 800, 800),
            ],
        ])->assertRedirect();

        $this->assertEquals(2, $work->photos()->count());

        $photo = $work->photos()->first();
        $this->assertStringEndsWith('.webp', $photo->file_path);
        $this->assertStringContainsString('_thumb.webp', $photo->thumb_path);
        Storage::disk('public')->assertExists($photo->file_path);
        Storage::disk('public')->assertExists($photo->thumb_path);
    }

    public function test_upload_ditolak_jika_bukan_gambar(): void
    {
        Storage::fake('public');
        $work = $this->work();

        $this->actingAs($this->admin())->post("/admin/works/{$work->id}/photos", [
            'foto' => [UploadedFile::fake()->create('dokumen.pdf', 100, 'application/pdf')],
        ])->assertSessionHasErrors('foto.0');
    }

    public function test_ambil_foto_dari_link_google_drive(): void
    {
        Storage::fake('public');
        Http::fake([
            'drive.google.com/*' => Http::response(
                UploadedFile::fake()->image('dari-drive.jpg')->get(), 200
            ),
        ]);
        $work = $this->work();

        $this->actingAs($this->admin())->post("/admin/works/{$work->id}/photos/drive", [
            'gdrive_link' => 'https://drive.google.com/file/d/1AbCdEfGhIjKlMnOp/view?usp=sharing',
        ])->assertRedirect();

        $this->assertEquals(1, $work->photos()->count());
    }

    public function test_link_drive_rusak_menampilkan_pesan_indonesia(): void
    {
        Storage::fake('public');
        Http::fake(['drive.google.com/*' => Http::response('Tidak ditemukan', 404)]);
        $work = $this->work();

        $this->actingAs($this->admin())->post("/admin/works/{$work->id}/photos/drive", [
            'gdrive_link' => 'https://drive.google.com/file/d/1AbCdEfGhIjKlMnOp/view',
        ])->assertSessionHasErrors('gdrive_link');

        $this->assertEquals(0, $work->photos()->count());
    }

    public function test_mengatur_cover_menggeser_cover_lama(): void
    {
        Storage::fake('public');
        $work = $this->work();
        $a = $work->photos()->create(['file_path' => 'works/1/a.webp', 'peran' => 'cover']);
        $b = $work->photos()->create(['file_path' => 'works/1/b.webp', 'peran' => 'detail']);

        $this->actingAs($this->admin())->patch("/admin/photos/{$b->id}", [
            'peran' => 'cover',
            'urutan' => 1,
        ])->assertRedirect();

        $this->assertEquals('detail', $a->fresh()->peran); // cover lama turun
        $this->assertEquals('cover', $b->fresh()->peran);  // cover baru
    }

    public function test_hapus_foto_juga_menghapus_file_fisiknya(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('works/1/a.webp', 'isi');
        Storage::disk('public')->put('works/1/a_thumb.webp', 'isi');

        $work = $this->work();
        $photo = $work->photos()->create([
            'file_path' => 'works/1/a.webp',
            'thumb_path' => 'works/1/a_thumb.webp',
            'peran' => 'detail',
        ]);

        $this->actingAs($this->admin())->delete("/admin/photos/{$photo->id}")->assertRedirect();

        $this->assertDatabaseMissing('photos', ['id' => $photo->id]);
        Storage::disk('public')->assertMissing('works/1/a.webp');
        Storage::disk('public')->assertMissing('works/1/a_thumb.webp');
    }
}