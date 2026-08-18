<?php

namespace App\Services;

use App\Models\Photo;
use App\Models\Work;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver as DriverGd;
use Intervention\Image\Drivers\Imagick\Driver as DriverImagick;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\ImageManager;
use RuntimeException;
use Throwable;

class PhotoService
{
    /** Endpoint unduhan Google Drive. Query dikirim terpisah, jangan disatukan jadi satu string URL. */
    public const DRIVE_ENDPOINT = 'https://drive.google.com/uc';

    public const MIME_DIIZINKAN = ['image/jpeg', 'image/png', 'image/webp'];

    private const LEBAR_UTAMA = [
        Photo::SLIDESHOW => 2600,
        Photo::COVER => 2400,
        Photo::ZIGZAG => 2000,
        Photo::THUMB => 1600,
    ];

    private const LEBAR_THUMB = [
        Photo::SLIDESHOW => 900,
        Photo::COVER => 900,
        Photo::ZIGZAG => 700,
        Photo::THUMB => 700,
    ];

    private const MUTU_UTAMA = 82;

    private const MUTU_THUMB = 74;

    private ?ImageManager $pengelola = null;

    /* ============================================================
     |  Simpan foto milik satu Work
     * ============================================================ */

    public function simpanDariUpload(UploadedFile $file, Work $work, string $penempatan): Photo
    {
        $this->pastikanPenempatanValid($penempatan);

        $paths = $this->prosesIsi(
            $this->isiDariUpload($file),
            $this->folderWork($work),
            self::LEBAR_UTAMA[$penempatan],
            self::LEBAR_THUMB[$penempatan]
        );

        return $this->buatFoto($work, $penempatan, $paths);
    }

    public function simpanDariLinkDrive(string $link, Work $work, string $penempatan): Photo
    {
        $this->pastikanPenempatanValid($penempatan);

        $fileId = $this->ambilFileId($link);

        if ($fileId === null) {
            throw new RuntimeException('Link Google Drive tidak dikenali. Pakai link berbagi file, bukan link folder.');
        }

        $respon = Http::timeout(60)->get(self::DRIVE_ENDPOINT, [
            'export' => 'download',
            'id' => $fileId,
        ]);

        if (! $respon->successful()) {
            throw new RuntimeException('Gagal mengunduh file dari Google Drive. Pastikan aksesnya publik.');
        }

        $mime = strtolower(trim(explode(';', (string) $respon->header('Content-Type'))[0]));

        if (! in_array($mime, self::MIME_DIIZINKAN, true)) {
            throw new RuntimeException('File dari Drive bukan gambar JPG, PNG, atau WebP. Untuk file besar, Drive meminta konfirmasi manual, jadi unggah manual saja.');
        }

        $isi = (string) $respon->body();

        if ($isi === '') {
            throw new RuntimeException('File dari Drive kosong. Coba unduh manual lalu unggah dari komputer.');
        }

        $paths = $this->prosesIsi(
            $isi,
            $this->folderWork($work),
            self::LEBAR_UTAMA[$penempatan],
            self::LEBAR_THUMB[$penempatan]
        );

        return $this->buatFoto($work, $penempatan, $paths);
    }

    /* ============================================================
     |  Simpan foto lepas (kategori, about)
     * ============================================================ */

    /**
     * @return array{file_path: string, thumb_path: string}
     */
    public function simpanKeFolder(UploadedFile $file, string $folder, int $lebarUtama = 2000, int $lebarThumb = 700): array
    {
        return $this->prosesIsi($this->isiDariUpload($file), $folder, $lebarUtama, $lebarThumb);
    }

    /**
     * Olah gambar dari jalur berkas di disk.
     *
     * @return array{file_path: string, thumb_path: string}
     */
    public function prosesFile(string $pathFile, string $folder, int $lebarUtama, int $lebarThumb): array
    {
        return $this->prosesIsi($this->isiDariPath($pathFile), $folder, $lebarUtama, $lebarThumb);
    }

    /**
     * Olah gambar dari isi berkas yang sudah ada di memori.
     *
     * @return array{file_path: string, thumb_path: string}
     */
    public function prosesIsi(string $isiGambar, string $folder, int $lebarUtama, int $lebarThumb): array
    {
        if ($isiGambar === '') {
            throw new RuntimeException('Isi gambar kosong, jadi tidak ada yang bisa diproses.');
        }

        $namaDasar = Str::random(20);

        $pathUtama = "{$folder}/{$namaDasar}.webp";
        $pathThumb = "{$folder}/{$namaDasar}_thumb.webp";

        $utama = $this->jadikanWebp($isiGambar, $lebarUtama, self::MUTU_UTAMA);
        $thumb = $this->jadikanWebp($isiGambar, $lebarThumb, self::MUTU_THUMB);

        if ($utama === '' || $thumb === '') {
            throw new RuntimeException('Hasil konversi WebP kosong. Pastikan ekstensi gambar PHP mendukung WebP.');
        }

        $tulisUtama = Storage::disk('public')->put($pathUtama, $utama);
        $tulisThumb = Storage::disk('public')->put($pathThumb, $thumb);

        if (! $tulisUtama || ! $tulisThumb) {
            throw new RuntimeException("Gagal menulis berkas ke folder \"storage/app/public/{$folder}\". Cek izin folder.");
        }

        return ['file_path' => $pathUtama, 'thumb_path' => $pathThumb];
    }

    /* ============================================================
     |  Urutan dan penghapusan
     * ============================================================ */

    /** @param array<int, int|string> $daftarId */
    public function urutkanUlang(Work $work, array $daftarId): void
    {
        foreach (array_values($daftarId) as $indeks => $id) {
            Photo::where('work_id', $work->id)->whereKey($id)->update(['urutan' => $indeks]);
        }
    }

    public function hapus(Photo $photo): void
    {
        $this->hapusFile($photo->file_path, $photo->thumb_path);
        $photo->delete();
    }

    public function hapusSemua(Work $work): void
    {
        foreach ($work->photos()->get() as $foto) {
            $this->hapus($foto);
        }

        Storage::disk('public')->deleteDirectory($this->folderWork($work));
    }

    public function hapusFile(?string $path, ?string $thumb = null): void
    {
        foreach ([$path, $thumb] as $berkas) {
            if (filled($berkas)) {
                Storage::disk('public')->delete($berkas);
            }
        }
    }

    /* ============================================================
     |  Bagian dalam
     * ============================================================ */

    /**
     * Ambil isi berkas unggahan.
     *
     * getRealPath() memakai realpath() bawaan PHP dan di Windows atau Laragon
     * fungsi itu sering mengembalikan false walaupun berkasnya ada. Nilai false
     * berubah menjadi teks kosong saat masuk parameter bertipe string, dan itulah
     * penyebab galat "empty string" pada pengurai gambar. Jadi jalur mentah dipakai
     * sebagai cadangan, lalu isinya dibaca sekali di sini.
     */
    private function isiDariUpload(UploadedFile $file): string
    {
        if (! $file->isValid()) {
            throw new RuntimeException('Unggahan gagal di tingkat PHP: '.$file->getErrorMessage());
        }

        $jalurAsli = $file->getRealPath();

        $kandidat = array_values(array_unique(array_filter([
            is_string($jalurAsli) && $jalurAsli !== '' ? $jalurAsli : null,
            $file->getPathname() !== '' ? $file->getPathname() : null,
        ])));

        foreach ($kandidat as $jalur) {
            $isi = @file_get_contents($jalur);

            if (is_string($isi) && $isi !== '') {
                return $isi;
            }
        }

        throw new RuntimeException($this->laporanJalur($file, $kandidat));
    }

    private function isiDariPath(string $pathFile): string
    {
        if ($pathFile === '') {
            throw new RuntimeException('Jalur berkas gambar kosong.');
        }

        if (! is_file($pathFile)) {
            throw new RuntimeException("Berkas gambar \"{$pathFile}\" tidak ditemukan.");
        }

        $isi = @file_get_contents($pathFile);

        if (! is_string($isi) || $isi === '') {
            throw new RuntimeException("Berkas gambar \"{$pathFile}\" tidak bisa dibaca atau isinya kosong.");
        }

        return $isi;
    }

    /** @param array<int, string> $kandidat */
    private function laporanJalur(UploadedFile $file, array $kandidat): string
    {
        $rincian = [];

        foreach ($kandidat as $jalur) {
            $rincian[] = sprintf(
                '"%s" (ada: %s, terbaca: %s, ukuran: %s)',
                $jalur,
                is_file($jalur) ? 'ya' : 'tidak',
                is_readable($jalur) ? 'ya' : 'tidak',
                is_file($jalur) ? (string) filesize($jalur) : '-'
            );
        }

        if ($rincian === []) {
            $rincian[] = 'tidak ada jalur berkas sama sekali';
        }

        return sprintf(
            'Berkas unggahan "%s" tidak bisa dibaca. Jalur yang dicoba: %s. Folder sementara PHP: "%s".',
            $file->getClientOriginalName(),
            implode(', ', $rincian),
            sys_get_temp_dir()
        );
    }

    private function buatFoto(Work $work, string $penempatan, array $paths): Photo
    {
        // Slideshow, thumb, dan cover hanya boleh satu per work: yang lama diganti.
        if (in_array($penempatan, Photo::PENEMPATAN_TUNGGAL, true)) {
            foreach ($work->photos()->where('penempatan', $penempatan)->get() as $lama) {
                $this->hapus($lama);
            }

            $urutan = 0;
        } else {
            $urutan = (int) $work->photos()->where('penempatan', $penempatan)->max('urutan') + 1;
        }

        return Photo::create([
            'work_id' => $work->id,
            'file_path' => $paths['file_path'],
            'thumb_path' => $paths['thumb_path'],
            'penempatan' => $penempatan,
            'urutan' => $urutan,
        ]);
    }

    private function pastikanPenempatanValid(string $penempatan): void
    {
        if (! in_array($penempatan, Photo::PENEMPATAN, true)) {
            throw new RuntimeException("Penempatan foto \"{$penempatan}\" tidak dikenali.");
        }
    }

    private function folderWork(Work $work): string
    {
        return "works/{$work->id}";
    }

    private function ambilFileId(string $link): ?string
    {
        $link = trim($link);

        if (preg_match('#/d/([a-zA-Z0-9_-]{10,})#', $link, $cocok)) {
            return $cocok[1];
        }

        if (preg_match('#[?&]id=([a-zA-Z0-9_-]{10,})#', $link, $cocok)) {
            return $cocok[1];
        }

        if (preg_match('#^[a-zA-Z0-9_-]{10,}$#', $link)) {
            return $link;
        }

        return null;
    }

    /* ------------------------------------------------------------ *
     |  Pengolahan gambar, Intervention Image 4.x
     * ------------------------------------------------------------ */

    private function jadikanWebp(string $isiGambar, int $lebar, int $mutu): string
    {
        try {
            $gambar = $this->pengelola()
                ->decodeBinary($isiGambar)
                ->scaleDown(width: $lebar);

            return (string) $gambar->encode(new WebpEncoder(quality: $mutu));
        } catch (Throwable $e) {
            throw new RuntimeException('Gagal memproses gambar: '.$e->getMessage(), 0, $e);
        }
    }

    private function pengelola(): ImageManager
    {
        if ($this->pengelola instanceof ImageManager) {
            return $this->pengelola;
        }

        return $this->pengelola = new ImageManager($this->driver());
    }

    private function driver(): string
    {
        // Ikuti konfigurasi paket kalau ada, dengan cadangan sesuai ekstensi PHP yang aktif.
        $dariConfig = config('image.driver');

        if (is_string($dariConfig) && class_exists($dariConfig)) {
            return $dariConfig;
        }

        if (extension_loaded('gd')) {
            return DriverGd::class;
        }

        if (extension_loaded('imagick')) {
            return DriverImagick::class;
        }

        throw new RuntimeException('PHP belum mengaktifkan ekstensi gd maupun imagick, jadi gambar tidak bisa diproses.');
    }
}