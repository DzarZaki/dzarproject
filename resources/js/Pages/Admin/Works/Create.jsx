import { Head, useForm } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import {
    Card,
    Field,
    FileInput,
    LinkButton,
    PageHeader,
    PrimaryButton,
    SelectInput,
    TextInput,
} from '@/Components/Admin/ui'

export default function Create({ jenis, labelJenis, ukuranPilihan = [], urutanBerikutnya = 1, categories = [] }) {
    const slideshow = jenis === 'slideshow'
    const horizontal = jenis === 'horizontal'
    const work = jenis === 'work'

    const kategoriKosong = work && categories.length === 0

    const { data, setData, post, processing, errors, progress } = useForm({
        jenis,
        judul: '',
        lokasi: '',
        category_id: '',
        ukuran: 'sedang',
        urutan: urutanBerikutnya,
        foto: null,
    })

    const kirim = (e) => {
        e.preventDefault()
        post(`/admin/works?jenis=${jenis}`, { forceFormData: true })
    }

    const labelFoto = slideshow
        ? 'Foto slide show'
        : horizontal
          ? 'Foto yang tampil di strip horizontal'
          : 'Foto yang tampil di halaman Works'

    const petunjukFoto = slideshow
        ? 'Pakai foto lanskap resolusi besar karena tampil selayar penuh. Maksimal 12 MB.'
        : horizontal
          ? 'Pakai foto potret. Ukuran tampilnya diatur oleh pilihan kecil, sedang, atau besar. Maksimal 12 MB.'
          : 'Foto akan dipotong persegi otomatis. Maksimal 12 MB.'

    return (
        <AdminLayout>
            <Head title={`Tambah ${labelJenis?.[jenis] ?? 'Data'}`} />

            <PageHeader
                judul={`Tambah ${labelJenis?.[jenis] ?? 'Data'}`}
                catatan={
                    slideshow
                        ? 'Slide show hanya butuh foto dan urutan tampil. Tidak ada halaman detail.'
                        : 'Isi data dasarnya dulu. Cover, link YouTube, dan foto zigzag diisi setelah ini lewat aksi "Foto".'
                }
                aksi={<LinkButton href={`/admin/works?jenis=${jenis}`}>Kembali</LinkButton>}
            />

            {kategoriKosong ? (
                <Card className="mb-6 border-[#f0e2bd] bg-[#fbf3db]">
                    <p className="text-sm text-[#956400]">
                        Belum ada kategori. Setiap work harus punya kategori supaya bisa dipilih di dropdown filter
                        halaman Works. Buat kategorinya dulu, lalu kembali ke sini.
                    </p>
                    <div className="mt-4">
                        <LinkButton href="/admin/categories/create">Buat kategori</LinkButton>
                    </div>
                </Card>
            ) : null}

            <form onSubmit={kirim} className="max-w-2xl">
                <Card className="space-y-5">
                    {slideshow ? null : (
                        <>
                            <Field label="Judul" wajib error={errors.judul} petunjuk="Nama sesi atau nama klien.">
                                <TextInput
                                    type="text"
                                    value={data.judul}
                                    onChange={(e) => setData('judul', e.target.value)}
                                    placeholder="Contoh: Wisuda Nadia"
                                    autoFocus
                                />
                            </Field>

                            <Field label="Lokasi" wajib error={errors.lokasi}>
                                <TextInput
                                    type="text"
                                    value={data.lokasi}
                                    onChange={(e) => setData('lokasi', e.target.value)}
                                    placeholder="Contoh: Semarang"
                                />
                            </Field>
                        </>
                    )}

                    {work ? (
                        <Field
                            label="Kategori"
                            wajib
                            error={errors.category_id}
                            petunjuk="Dipakai oleh dropdown filter kategori di halaman Works."
                        >
                            <SelectInput
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                                disabled={kategoriKosong}
                            >
                                <option value="">Pilih kategori</option>
                                {categories.map((k) => (
                                    <option key={k.id} value={k.id}>
                                        {k.nama}
                                    </option>
                                ))}
                            </SelectInput>
                        </Field>
                    ) : null}

                    {horizontal ? (
                        <Field label="Ukuran foto" wajib error={errors.ukuran}>
                            <SelectInput value={data.ukuran} onChange={(e) => setData('ukuran', e.target.value)}>
                                {ukuranPilihan.map((u) => (
                                    <option key={u} value={u}>
                                        {u}
                                    </option>
                                ))}
                            </SelectInput>
                        </Field>
                    ) : null}

                    <Field label="Urutan tampil" error={errors.urutan} petunjuk="Angka kecil tampil lebih dulu.">
                        <TextInput
                            type="number"
                            min="0"
                            value={data.urutan}
                            onChange={(e) => setData('urutan', e.target.value)}
                        />
                    </Field>

                    <Field label={labelFoto} wajib error={errors.foto} petunjuk={petunjukFoto}>
                        <FileInput
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => setData('foto', e.target.files?.[0] ?? null)}
                        />
                    </Field>

                    {progress ? (
                        <div className="h-1 w-full overflow-hidden rounded-full bg-line">
                            <div
                                className="h-1 rounded-full bg-ink transition-[width] duration-150"
                                style={{ width: `${progress.percentage}%` }}
                            />
                        </div>
                    ) : null}

                    <div className="flex items-center gap-3 pt-1">
                        <PrimaryButton type="submit" disabled={processing || kategoriKosong}>
                            {processing ? 'Menyimpan' : 'Simpan'}
                        </PrimaryButton>
                        <LinkButton href={`/admin/works?jenis=${jenis}`}>Batal</LinkButton>
                    </div>
                </Card>
            </form>
        </AdminLayout>
    )
}