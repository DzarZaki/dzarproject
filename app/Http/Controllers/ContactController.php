<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Contact', [
            'waNumber' => config('services.dzarproject.wa_number'),
        ]);
    }

    public function kirim(Request $request): RedirectResponse
    {
        $request->validate([
            'nama' => ['required', 'string', 'max:120'],
            'telepon' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:150'],
            'acara' => ['nullable', 'string', 'max:120'],
            'pesan' => ['required', 'string', 'min:10', 'max:2000'],
        ], [
            'nama.required' => 'Nama wajib diisi.',
            'pesan.required' => 'Pesan wajib diisi.',
            'pesan.min' => 'Tulis pesan minimal 10 karakter.',
            'email.email' => 'Format email tidak valid.',
        ]);

        return back()->with('sukses', 'Pesan sudah tersimpan. Untuk balasan tercepat, lanjutkan lewat WhatsApp.');
    }
}