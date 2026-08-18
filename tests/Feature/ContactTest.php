<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ContactTest extends TestCase
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

    public function test_halaman_contact_punya_halaman_sendiri(): void
    {
        $this->get('/contact')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Contact')
                ->has('waNumber')
            );
    }

    public function test_pesan_valid_menghasilkan_link_whatsapp(): void
    {
        $this->post('/contact', $this->pesanValid())
            ->assertSessionHas('wa_url');

        $this->assertStringStartsWith('https://wa.me/', session('wa_url'));
    }

    public function test_semua_field_wajib_valid(): void
    {
        $this->post('/contact', [])
            ->assertSessionHasErrors(['nama', 'email', 'no_wa', 'pesan']);
    }

    public function test_honeypot_terisi_maka_ditolak_diam_diam(): void
    {
        $this->post('/contact', [...$this->pesanValid(), 'alamat_web' => 'http://spam.com'])
            ->assertSessionDoesntHaveErrors()
            ->assertSessionMissing('wa_url');
    }

    public function test_rate_limit_setelah_tiga_kali_kirim(): void
    {
        for ($i = 0; $i < 3; $i++) {
            $this->post('/contact', $this->pesanValid());
        }

        $this->post('/contact', $this->pesanValid())
            ->assertSessionHasErrors('nama');
    }
}
