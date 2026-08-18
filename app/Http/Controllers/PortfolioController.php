<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Work;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioController extends Controller
{
    public function index(Request $request): Response
    {
        $slugKategori = $request->string('kategori')->toString();
        $lokasiDiminta = trim($request->string('lokasi')->toString());

        $kategoriAktif = $slugKategori !== ''
            ? Category::where('slug', $slugKategori)->first()
            : null;

        // saringan lokasi hanya memakai bagian terakhir dari isian lokasi,
        // jadi "Malioboro, Yogyakarta" masuk ke pilihan "Yogyakarta";
        // daftarnya diambil dari seluruh karya supaya pilihan tidak menghilang
        // setelah kategori dipilih
        $locations = Work::jenis(Work::JENIS_WORK)
            ->whereNotNull('lokasi')
            ->where('lokasi', '!=', '')
            ->pluck('lokasi')
            ->map(fn ($l) => $this->kotaDari($l))
            ->filter()
            ->unique(fn ($l) => mb_strtolower($l))
            ->sort(fn ($a, $b) => strcasecmp($a, $b))
            ->values();

        // lokasi hanya dipakai kalau memang ada dalam daftar, jadi isian sembarang
        // pada alamat tidak membuat halaman jadi kosong tanpa penjelasan
        $lokasiAktif = $locations->first(
            fn ($l) => mb_strtolower($l) === mb_strtolower($lokasiDiminta)
        );

        $works = Work::jenis(Work::JENIS_WORK)
            ->with(['fotoThumb', 'category'])
            ->when($kategoriAktif, fn ($q) => $q->where('category_id', $kategoriAktif->id))
            ->urut()
            ->get()
            ->filter(fn (Work $w) => $w->fotoThumb !== null && $w->slug !== null)
            ->when(
                $lokasiAktif !== null,
                fn ($daftar) => $daftar->filter(
                    fn (Work $w) => mb_strtolower($this->kotaDari($w->lokasi)) === mb_strtolower((string) $lokasiAktif)
                )
            )
            ->map(fn (Work $w) => [
                'id' => $w->id,
                'judul' => $w->judul,
                'slug' => $w->slug,
                'lokasi' => $w->lokasi,
                'kategori' => $w->category?->nama,
                'thumb' => $w->fotoThumb->thumb_url,
                'url' => $w->fotoThumb->url,
                'link' => route('works.show', $w->slug),
            ])
            ->values();

        $categories = Category::urut()->get()->map(fn (Category $c) => [
            'nama' => $c->nama,
            'slug' => $c->slug,
        ])->values();

        return Inertia::render('Works/Index', [
            'works' => $works,
            'categories' => $categories,
            'locations' => $locations,
            'kategoriAktif' => $kategoriAktif?->slug,
            'lokasiAktif' => $lokasiAktif,
        ]);
    }

    public function show(Work $work): Response
    {
        abort_unless($work->punyaDetail(), 404);

        $work->load(['category', 'fotoCover', 'fotoThumb', 'fotoZigzag']);

        $tetangga = fn (string $arah) => Work::where('jenis', $work->jenis)
            ->whereNotNull('slug')
            ->whereKeyNot($work->id)
            ->when(
                $arah === 'berikutnya',
                fn ($q) => $q->where('urutan', '>=', $work->urutan)->orderBy('urutan')->orderBy('id'),
                fn ($q) => $q->where('urutan', '<=', $work->urutan)->orderByDesc('urutan')->orderByDesc('id')
            )
            ->first();

        $ringkas = fn (?Work $w) => $w ? [
            'judul' => $w->judul,
            'link' => route('works.show', $w->slug),
        ] : null;

        return Inertia::render('Works/Show', [
            'work' => [
                'judul' => $work->judul,
                'lokasi' => $work->lokasi,
                'deskripsi' => $work->deskripsi,
                'kategori' => $work->category?->nama,
                'cover_url' => $work->fotoCover?->url ?? $work->fotoThumb?->url,
                'embed_url' => $work->embed_url,
                'zigzag' => $work->fotoZigzag->map(fn ($f) => [
                    'id' => $f->id,
                    'url' => $f->url,
                    'thumb' => $f->thumb_url,
                ])->values(),
            ],
            'sebelumnya' => $ringkas($tetangga('sebelumnya')),
            'berikutnya' => $ringkas($tetangga('berikutnya')),
        ]);
    }

    /**
     * Mengambil bagian kota dari isian lokasi.
     * "Malioboro, Yogyakarta" menjadi "Yogyakarta", "Bali" tetap "Bali".
     */
    private function kotaDari(?string $lokasi): string
    {
        $bagian = array_values(array_filter(
            array_map('trim', explode(',', (string) $lokasi)),
            fn ($b) => $b !== ''
        ));

        return $bagian === [] ? '' : $bagian[count($bagian) - 1];
    }
}