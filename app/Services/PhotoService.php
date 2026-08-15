<?php

namespace App\Services;

use App\Models\Photo;
use App\Models\Work;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Format;
use Intervention\Image\Laravel\Facades\Image;

class PhotoService
{
    /** Simpan foto dari upload biasa (untuk foto work). */
    public function simpanDariUpload(UploadedFile $file, Work $work): Photo
    {
        $paths = $this->prosesFile($file->getRealPath(), "works/{$work->id}");

        return $work->photos()->create([
            ...$paths,
            'peran' => 'detail',
            'urutan' => ($work->photos()->max('urutan') ?? 0) + 1,
        ]);
    }

    /** Unduh SEKALI dari link Google Drive, lalu simpan lokal (auto-cache). */
    public function simpanDariLinkDrive(string $link, Work $work): Photo
    {
        $fileId = $this->ambilFileId($link);

        if (! $fileId) {
            throw new \RuntimeException('Link Google Drive tidak dikenali. Gunakan link berbagi file (drive.google.com/file/d/…).');
        }

        $response = Http::timeout(30)->get("https://drive.google.com/uc?export=download&id={$fileId}");

        if (! $response->ok()) {
            throw new \RuntimeException('File tidak dapat diunduh. Pastikan file dibagikan ke "Siapa saja yang memiliki link".');
        }

        $sementara = storage_path('app/tmp/'.Str::random(16));
        if (! is_dir(dirname($sementara))) {
            mkdir(dirname($sementara), 0755, true);
        }
        file_put_contents($sementara, $response->body());

        $mime = mime_content_type($sementara);
        if (! in_array($mime, ['image/jpeg', 'image/png', 'image/webp'])) {
            @unlink($sementara);
            throw new \RuntimeException('Isi link bukan gambar yang didukung (JPG/PNG/WebP).');
        }

        try {
            $paths = $this->prosesFile($sementara, "works/{$work->id}");

            return $work->photos()->create([
                ...$paths,
                'peran' => 'detail',
                'urutan' => ($work->photos()->max('urutan') ?? 0) + 1,
            ]);
        } finally {
            @unlink($sementara);
        }
    }

    /** Proses file gambar apa pun → WebP + thumbnail. Return path-nya. */
    public function prosesFile(string $pathFile, string $folder): array
    {
        $namaDasar = Str::random(20);

        $gambar = Image::decodePath($pathFile)->scaleDown(width: 2400);
        $thumb = Image::decodePath($pathFile)->scaleDown(width: 600);

        Storage::disk('public')->put(
            "{$folder}/{$namaDasar}.webp",
            (string) $gambar->encodeUsingFormat(Format::WEBP, quality: 82)
        );
        Storage::disk('public')->put(
            "{$folder}/{$namaDasar}_thumb.webp",
            (string) $thumb->encodeUsingFormat(Format::WEBP, quality: 75)
        );

        return [
            'file_path' => "{$folder}/{$namaDasar}.webp",
            'thumb_path' => "{$folder}/{$namaDasar}_thumb.webp",
        ];
    }

    /** Hapus file fisik saja (tanpa model). */
    public function hapusFile(?string $filePath, ?string $thumbPath = null): void
    {
        Storage::disk('public')->delete(array_filter([$filePath, $thumbPath]));
    }

    /** Hapus baris database + file fisiknya (foto work). */
    public function hapus(Photo $photo): void
    {
        $this->hapusFile($photo->file_path, $photo->thumb_path);
        $photo->delete();
    }

    /** Ambil file ID dari berbagai bentuk link Google Drive. */
    private function ambilFileId(string $link): ?string
    {
        if (preg_match('#/file/d/([a-zA-Z0-9_-]+)#', $link, $m)) {
            return $m[1];
        }

        if (preg_match('#[?&]id=([a-zA-Z0-9_-]+)#', $link, $m)) {
            return $m[1];
        }

        return null;
    }
}