<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KontakTest extends TestCase
{
    use RefreshDatabase;

    private function pesanValid(): array
    {
        return [
            'nama' => 'Budi',
            'email' => 'budi@contoh.com',
            'no_wa' => '081234567890',
            'pesan' => 'Halo, saya mau tanya paket wedding.',
        ];
    }

    public function test_pesan_valid_menghasilkan_link_whatsapp(): void
    {
        $this->post('/kontak', $this->pesanValid())
            ->assertSessionHas('wa_url');

        $this->assertStringStartsWith('https://wa.me/', session('wa_url'));
    }

    public function test_semua_field_wajib_valid(): void
    {
        $this->post('/kontak', [])
            ->assertSessionHasErrors(['nama', 'email', 'no_wa', 'pesan']);
    }

    public function test_honeypot_terisi_maka_ditolak_diam_diam(): void
    {
        // Bot mengisi field tersembunyi → tidak ada error, tapi tidak dapat wa_url
        $this->post('/kontak', [...$this->pesanValid(), 'alamat_web' => 'http://spam.com'])
            ->assertSessionDoesntHaveErrors()
            ->assertSessionMissing('wa_url');
    }

    public function test_rate_limit_setelah_tiga_kali_kirim(): void
    {
        for ($i = 0; $i < 3; $i++) {
            $this->post('/kontak', $this->pesanValid());
        }

        // Kiriman ke-4 dalam 5 menit → ditolak dengan pesan Bahasa Indonesia
        $this->post('/kontak', $this->pesanValid())
            ->assertSessionHasErrors('nama');
    }
}