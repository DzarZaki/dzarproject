<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VideoController extends Controller
{
    private const REGEX_YOUTUBE = '#(?:youtube\.com/(?:watch\?.*v=|shorts/|embed/|live/)|youtu\.be/)[a-zA-Z0-9_-]{11}#';

    public function index(): Response
    {
        $videos = Video::orderBy('urutan')->orderBy('id')->get()->map(fn (Video $v) => [
            'id' => $v->id,
            'judul' => $v->judul,
            'youtube_url' => $v->youtube_url,
            'embed_url' => $v->embed_url,
            'urutan' => $v->urutan,
        ])->values();

        return Inertia::render('Admin/Videos/Index', [
            'videos' => $videos,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Videos/Create', [
            'urutanBerikutnya' => (int) Video::max('urutan') + 1,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Video::create($this->validasi($request));

        return redirect()->route('admin.videos.index')->with('sukses', 'Video ditambahkan.');
    }

    public function edit(Video $video): Response
    {
        return Inertia::render('Admin/Videos/Edit', [
            'video' => [
                'id' => $video->id,
                'judul' => $video->judul,
                'youtube_url' => $video->youtube_url,
                'urutan' => $video->urutan,
            ],
        ]);
    }

    public function update(Request $request, Video $video): RedirectResponse
    {
        $video->update($this->validasi($request));

        return redirect()->route('admin.videos.index')->with('sukses', 'Video diperbarui.');
    }

    public function destroy(Video $video): RedirectResponse
    {
        $video->delete();

        return redirect()->route('admin.videos.index')->with('sukses', 'Video dihapus.');
    }

    private function validasi(Request $request): array
    {
        return $request->validate([
            'judul' => ['nullable', 'string', 'max:150'],
            'youtube_url' => ['required', 'string', 'max:255', 'regex:'.self::REGEX_YOUTUBE],
            'urutan' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ], [
            'youtube_url.required' => 'Link YouTube wajib diisi.',
            'youtube_url.regex' => 'Link YouTube tidak dikenali. Tempel link watch, youtu.be, atau shorts.',
            'urutan.integer' => 'Urutan tampil harus berupa angka.',
        ]);
    }
}