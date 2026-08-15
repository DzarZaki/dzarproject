<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VideoController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Videos/Index', [
            'videos' => Video::orderBy('urutan')->orderByDesc('created_at')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Videos/Create');
    }

    public function store(Request $request)
    {
        Video::create($this->validated($request));

        return redirect()->route('admin.videos.index');
    }

    public function edit(Video $video)
    {
        return Inertia::render('Admin/Videos/Edit', ['video' => $video]);
    }

    public function update(Request $request, Video $video)
    {
        $video->update($this->validated($request));

        return redirect()->route('admin.videos.index');
    }

    public function destroy(Video $video)
    {
        $video->delete();

        return redirect()->route('admin.videos.index');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'judul' => ['nullable', 'string', 'max:150'],
            'youtube_url' => ['required', 'url', 'max:255', 'regex:#(youtube\.com|youtu\.be)#i'],
            'urutan' => ['nullable', 'integer', 'min:0'],
        ], [
            'judul.max' => 'Judul maksimal 150 karakter.',
            'youtube_url.required' => 'Link YouTube wajib diisi.',
            'youtube_url.url' => 'Format link tidak valid.',
            'youtube_url.regex' => 'Link harus berasal dari YouTube (youtube.com atau youtu.be).',
            'urutan.integer' => 'Urutan harus berupa angka.',
        ]);
    }
}