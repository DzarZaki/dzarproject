<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\About;
use App\Models\Category;
use App\Models\Photo;
use App\Models\Video;
use App\Models\Work;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $jumlahKategori = Category::count();
        $jumlahSlideshow = Work::jenis(Work::JENIS_SLIDESHOW)->count();
        $jumlahHorizontal = Work::jenis(Work::JENIS_HORIZONTAL)->count();
        $jumlahWork = Work::jenis(Work::JENIS_WORK)->count();
        $jumlahVideo = Video::count();

        $about = About::singleton();
        $aboutSiap = filled($about->paragraf_1) && filled($about->foto_portrait_path) && filled($about->foto_full_path);

        // Berapa work/horizontal yang halaman detailnya belum diisi (belum ada cover).
        $detailBelumLengkap = Work::whereNot('jenis', Work::JENIS_SLIDESHOW)
            ->whereDoesntHave('photos', fn ($q) => $q->where('penempatan', Photo::COVER))
            ->count();

        $langkah = [
            [
                'nomor' => 1,
                'judul' => 'Buat kategori',
                'catatan' => 'Foto lanskap kategori hanya pajangan di landing page, tidak masuk halaman Works. Diklik akan mengarah ke Works yang tersaring.',
                'selesai' => $jumlahKategori > 0,
                'jumlah' => $jumlahKategori,
                'link' => route('admin.categories.index'),
            ],
            [
                'nomor' => 2,
                'judul' => 'Isi slide show',
                'catatan' => 'Foto full screen paling atas. Tidak punya halaman detail.',
                'selesai' => $jumlahSlideshow > 0,
                'jumlah' => $jumlahSlideshow,
                'link' => route('admin.works.index', ['jenis' => Work::JENIS_SLIDESHOW]),
            ],
            [
                'nomor' => 3,
                'judul' => 'Isi foto horizontal',
                'catatan' => 'Strip yang bergerak ke kiri saat halaman digulir.',
                'selesai' => $jumlahHorizontal > 0,
                'jumlah' => $jumlahHorizontal,
                'link' => route('admin.works.index', ['jenis' => Work::JENIS_HORIZONTAL]),
            ],
            [
                'nomor' => 4,
                'judul' => 'Isi work',
                'catatan' => 'Kartu persegi di halaman Works.',
                'selesai' => $jumlahWork > 0,
                'jumlah' => $jumlahWork,
                'link' => route('admin.works.index', ['jenis' => Work::JENIS_WORK]),
            ],
            [
                'nomor' => 5,
                'judul' => 'Lengkapi halaman detail',
                'catatan' => 'Klik aksi "Foto" pada baris foto horizontal dan work: cover, link YouTube, foto zigzag.',
                'selesai' => $detailBelumLengkap === 0 && ($jumlahHorizontal + $jumlahWork) > 0,
                'jumlah' => $detailBelumLengkap,
                'link' => route('admin.works.index', ['jenis' => Work::JENIS_WORK]),
            ],
            [
                'nomor' => 6,
                'judul' => 'Isi video',
                'catatan' => 'Video ini yang main otomatis saat pengunjung sampai ke section Videos.',
                'selesai' => $jumlahVideo > 0,
                'jumlah' => $jumlahVideo,
                'link' => route('admin.videos.index'),
            ],
            [
                'nomor' => 7,
                'judul' => 'Isi halaman About',
                'catatan' => 'Judul, dua paragraf, foto portrait, dan foto lebar.',
                'selesai' => $aboutSiap,
                'jumlah' => $aboutSiap ? 1 : 0,
                'link' => route('admin.about.edit'),
            ],
        ];

        return Inertia::render('Admin/Dashboard', [
            'statistik' => [
                'kategori' => $jumlahKategori,
                'slideshow' => $jumlahSlideshow,
                'horizontal' => $jumlahHorizontal,
                'work' => $jumlahWork,
                'video' => $jumlahVideo,
                'detailBelumLengkap' => $detailBelumLengkap,
            ],
            'langkah' => $langkah,
        ]);
    }
}