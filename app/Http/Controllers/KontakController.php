<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class KontakController extends Controller
{
    public function kirim(Request $request)
    {
        // 1. Honeypot: field tersembunyi yang hanya diisi bot.
        //    Kalau terisi → pura-pura sukses tanpa menghasilkan apa pun.
        if ($request->filled('alamat_web')) {
            return back();
        }

        // 2. Validasi dulu (typo pengunjung asli tidak menguras kuota rate limit)
        $data = $request->validate([
            'nama' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:150'],
            'no_wa' => ['required', 'string', 'max:20', 'regex:/^[0-9+\-\s]+$/'],
            'pesan' => ['required', 'string', 'max:1000'],
        ], [
            'nama.required' => 'Nama wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'no_wa.required' => 'Nomor WhatsApp wajib diisi.',
            'no_wa.regex' => 'Nomor WhatsApp hanya boleh berisi angka, spasi, + atau -.',
            'pesan.required' => 'Pesan wajib diisi.',
            'pesan.max' => 'Pesan maksimal 1000 karakter.',
        ]);

        // 3. Rate limit: maksimal 3 pesan per 5 menit per IP
        $key = 'kontak:'.$request->ip();

        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);

            throw ValidationException::withMessages([
                'nama' => "Terlalu sering mengirim pesan. Coba lagi dalam {$seconds} detik.",
            ]);
        }

        RateLimiter::hit($key, 300);

        // 4. Susun pesan terformat lalu kembalikan link wa.me
        $teks = "Halo DzarProject! Saya {$data['nama']}.\n\n"
            . "Email: {$data['email']}\n"
            . "No. WA: {$data['no_wa']}\n\n"
            . "Pesan:\n{$data['pesan']}";

        $waUrl = 'https://wa.me/'.config('services.dzarproject.wa_number')
            .'?text='.rawurlencode($teks);

        return back()->with('wa_url', $waUrl);
    }
}