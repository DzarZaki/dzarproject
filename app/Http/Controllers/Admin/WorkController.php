<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Photo;
use App\Models\Work;
use App\Services\PhotoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class WorkController extends Controller
{
    public function __construct(private readonly PhotoService $foto) {}

    public function index(Request $request): Response
    {
        $jenis = $this->jenisDariRequest($request);

        $works = Work::jenis($jenis)
            ->with(['category', 'fotoSlideshow', 'fotoThumb', 'fotoCover'])
            ->withCount(['photos as jumlah_zigzag' => fn ($q) => $q->where('penempatan', Photo::ZIGZAG)])
            ->urut()
            ->get()
            ->map(fn (Work $w) => [
                'id' => $w->id,
                'judul' => $w->judul,
                'lokasi' => $w->lokasi,
                'kategori' => $w->category?->nama,
                'ukuran' => $w->ukuran,
                'urutan' => $w->urutan,
                'thumb' => $jenis === Work::JENIS_SLIDESHOW
                    ? $w->fotoSlideshow?->thumb_url
                    : $w->fotoThumb?->thumb_url,
                'punya_cover' => $w->fotoCover !== null,
                'punya_video' => filled($w->youtube_url),
                'jumlah_zigzag' => $w->jumlah_zigzag,
            ])
            ->values();

        return Inertia::render('Admin/Works/Index', [
            'jenis' => $jenis,
            'labelJenis' => Work::LABEL_JENIS,
            'works' => $works,
        ]);
    }

    public function create(Request $request): Response
    {
        $jenis = $this->jenisDariRequest($request);

        return Inertia::render('Admin/Works/Create', [
            'jenis' => $jenis,
            'labelJenis' => Work::LABEL_JENIS,
            'ukuranPilihan' => Work::UKURAN,
            'urutanBerikutnya' => (int) Work::jenis($jenis)->max('urutan') + 1,
            'categories' => $jenis === Work::JENIS_WORK ? $this->daftarKategori() : [],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $jenis = $this->jenisDariRequest($request);
        $data = $this->validasi($request, $jenis, wajibFoto: true);

        $work = Work::create([
            'jenis' => $jenis,
            'judul' => $data['judul'] ?? null,
            'slug' => isset($data['judul']) ? $this->slugUnik($data['judul']) : null,
            'lokasi' => $data['lokasi'] ?? null,
            'category_id' => $jenis === Work::JENIS_WORK ? (int) $data['category_id'] : null,
            'ukuran' => $jenis === Work::JENIS_HORIZONTAL ? ($data['ukuran'] ?? 'sedang') : null,
            'urutan' => $data['urutan'] ?? 0,
        ]);

        $this->foto->simpanDariUpload(
            $request->file('foto'),
            $work,
            $jenis === Work::JENIS_SLIDESHOW ? Photo::SLIDESHOW : Photo::THUMB
        );

        $pesan = $jenis === Work::JENIS_SLIDESHOW
            ? 'Slide show ditambahkan.'
            : 'Data ditambahkan. Lanjutkan dengan aksi "Foto" untuk mengisi halaman detail.';

        return redirect()
            ->route('admin.works.index', ['jenis' => $jenis])
            ->with('sukses', $pesan);
    }

    public function edit(Work $work): Response
    {
        return Inertia::render('Admin/Works/Edit', [
            'jenis' => $work->jenis,
            'labelJenis' => Work::LABEL_JENIS,
            'ukuranPilihan' => Work::UKURAN,
            'categories' => $work->jenis === Work::JENIS_WORK ? $this->daftarKategori() : [],
            'work' => [
                'id' => $work->id,
                'judul' => $work->judul,
                'lokasi' => $work->lokasi,
                'category_id' => $work->category_id,
                'ukuran' => $work->ukuran,
                'urutan' => $work->urutan,
                'thumb' => $work->jenis === Work::JENIS_SLIDESHOW
                    ? $work->fotoSlideshow?->thumb_url
                    : $work->fotoThumb?->thumb_url,
            ],
        ]);
    }

    public function update(Request $request, Work $work): RedirectResponse
    {
        $data = $this->validasi($request, $work->jenis, wajibFoto: false);

        $judul = $data['judul'] ?? $work->judul;

        $atribut = [
            'judul' => $judul,
            'lokasi' => $data['lokasi'] ?? $work->lokasi,
            'ukuran' => $work->jenis === Work::JENIS_HORIZONTAL
                ? ($data['ukuran'] ?? $work->ukuran)
                : null,
            'urutan' => $data['urutan'] ?? $work->urutan,
        ];

        // Slug ikut diperbarui saat judul berubah, supaya alamat halaman detail tetap masuk akal.
        if ($work->jenis !== Work::JENIS_SLIDESHOW && filled($judul) && $judul !== $work->judul) {
            $atribut['slug'] = $this->slugUnik($judul, $work->id);
        }

        if ($work->jenis === Work::JENIS_WORK && isset($data['category_id'])) {
            $atribut['category_id'] = (int) $data['category_id'];
        }

        $work->update($atribut);

        if ($request->hasFile('foto')) {
            $this->foto->simpanDariUpload(
                $request->file('foto'),
                $work,
                $work->jenis === Work::JENIS_SLIDESHOW ? Photo::SLIDESHOW : Photo::THUMB
            );
        }

        return redirect()
            ->route('admin.works.index', ['jenis' => $work->jenis])
            ->with('sukses', 'Perubahan disimpan.');
    }

    public function destroy(Work $work): RedirectResponse
    {
        $jenis = $work->jenis;

        $this->foto->hapusSemua($work);
        $work->delete();

        return redirect()
            ->route('admin.works.index', ['jenis' => $jenis])
            ->with('sukses', 'Data dihapus.');
    }

    /* ----------------------------------------------------------- */

    private function jenisDariRequest(Request $request): string
    {
        $jenis = $request->string('jenis')->toString();

        return in_array($jenis, Work::JENIS, true) ? $jenis : Work::JENIS_SLIDESHOW;
    }

    /** @return array<int, array{id: int, nama: string}> */
    private function daftarKategori(): array
    {
        return Category::urut()
            ->get(['id', 'nama'])
            ->map(fn (Category $c) => ['id' => $c->id, 'nama' => $c->nama])
            ->values()
            ->all();
    }

    private function validasi(Request $request, string $jenis, bool $wajibFoto): array
    {
        $aturanFoto = [
            $wajibFoto ? 'required' : 'nullable',
            'image',
            'mimes:jpg,jpeg,png,webp',
            'max:12288',
        ];

        if ($jenis === Work::JENIS_SLIDESHOW) {
            return $request->validate([
                'foto' => $aturanFoto,
                'urutan' => ['nullable', 'integer', 'min:0', 'max:9999'],
            ], $this->pesan());
        }

        $aturan = [
            'judul' => ['required', 'string', 'max:150'],
            'lokasi' => ['required', 'string', 'max:150'],
            'urutan' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'foto' => $aturanFoto,
        ];

        if ($jenis === Work::JENIS_HORIZONTAL) {
            $aturan['ukuran'] = ['required', Rule::in(Work::UKURAN)];
        }

        // Kategori wajib untuk jenis Work, karena dipakai dropdown filter di halaman Works.
        if ($jenis === Work::JENIS_WORK) {
            $aturan['category_id'] = ['required', 'integer', Rule::exists('categories', 'id')];
        }

        return $request->validate($aturan, $this->pesan());
    }

    private function pesan(): array
    {
        return [
            'judul.required' => 'Judul wajib diisi.',
            'lokasi.required' => 'Lokasi wajib diisi.',
            'category_id.required' => 'Kategori wajib dipilih.',
            'category_id.integer' => 'Kategori tidak dikenali.',
            'category_id.exists' => 'Kategori yang dipilih sudah tidak ada.',
            'ukuran.required' => 'Pilih ukuran foto: kecil, sedang, atau besar.',
            'ukuran.in' => 'Ukuran foto hanya boleh kecil, sedang, atau besar.',
            'foto.required' => 'Foto wajib diunggah.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.mimes' => 'Format gambar harus JPG, PNG, atau WebP.',
            'foto.max' => 'Ukuran gambar maksimal 12 MB.',
            'urutan.integer' => 'Urutan tampil harus berupa angka.',
        ];
    }

    private function slugUnik(string $judul, ?int $abaikanId = null): string
    {
        $dasar = Str::slug($judul) ?: 'work';
        $slug = $dasar;
        $nomor = 2;

        while (
            Work::where('slug', $slug)
                ->when($abaikanId, fn ($q) => $q->whereKeyNot($abaikanId))
                ->exists()
        ) {
            $slug = $dasar.'-'.$nomor;
            $nomor++;
        }

        return $slug;
    }
}