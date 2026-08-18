<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\Video;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class VideoTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create();
    }

    public function test_tamu_tidak_bisa_mengakses_daftar_video(): void
    {
        $this->get('/admin/videos')->assertRedirect('/login');
    }

    public function test_admin_bisa_melihat_daftar_video(): void
    {
        Video::create(['youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ']);

        $this->actingAs($this->admin())
            ->get('/admin/videos')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Videos/Index')
                ->has('videos', 1)
            );
    }

    public function test_admin_bisa_menambah_video(): void
    {
        $this->actingAs($this->admin())->post('/admin/videos', [
            'judul' => 'Film A & Z',
            'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'urutan' => 1,
        ])->assertRedirect(route('admin.videos.index'));

        $this->assertDatabaseHas('videos', ['judul' => 'Film A & Z']);
    }

    public function test_link_wajib_dan_harus_dari_youtube(): void
    {
        // Link kosong → ditolak
        $this->actingAs($this->admin())
            ->post('/admin/videos', ['youtube_url' => ''])
            ->assertSessionHasErrors('youtube_url');

        // Link valid tapi bukan YouTube → ditolak
        $this->actingAs($this->admin())
            ->post('/admin/videos', ['youtube_url' => 'https://vimeo.com/12345'])
            ->assertSessionHasErrors('youtube_url');
    }

    public function test_embed_url_terbentuk_dari_berbagai_format_link(): void
    {
        $watch = Video::create(['youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ']);
        $pendek = Video::create(['youtube_url' => 'https://youtu.be/dQw4w9WgXcQ']);
        $shorts = Video::create(['youtube_url' => 'https://www.youtube.com/shorts/dQw4w9WgXcQ']);

        $this->assertEquals('https://www.youtube.com/embed/dQw4w9WgXcQ', $watch->embed_url);
        $this->assertEquals('https://www.youtube.com/embed/dQw4w9WgXcQ', $pendek->embed_url);
        $this->assertEquals('https://www.youtube.com/embed/dQw4w9WgXcQ', $shorts->embed_url);
    }

    public function test_admin_bisa_mengubah_video(): void
    {
        $video = Video::create(['youtube_url' => 'https://youtu.be/dQw4w9WgXcQ', 'urutan' => 2]);

        $this->actingAs($this->admin())->put("/admin/videos/{$video->id}", [
            'judul' => 'Film B & S',
            'youtube_url' => 'https://youtu.be/dQw4w9WgXcQ',
            'urutan' => 1,
        ])->assertRedirect(route('admin.videos.index'));

        $this->assertDatabaseHas('videos', ['id' => $video->id, 'judul' => 'Film B & S', 'urutan' => 1]);
    }

    public function test_admin_bisa_menghapus_video(): void
    {
        $video = Video::create(['youtube_url' => 'https://youtu.be/dQw4w9WgXcQ']);

        $this->actingAs($this->admin())
            ->delete("/admin/videos/{$video->id}")
            ->assertRedirect(route('admin.videos.index'));

        $this->assertDatabaseMissing('videos', ['id' => $video->id]);
    }
}
