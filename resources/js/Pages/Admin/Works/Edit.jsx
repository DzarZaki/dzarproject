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
    Thumb,
} from '@/Components/Admin/ui'

export default function Edit({ jenis, labelJenis, ukuranPilihan = [], work, categories = [] }) {
    const slideshow = jenis === 'slideshow'
    const horizontal = jenis === 'horizontal'
    const jenisWork = jenis === 'work'

    const rasio = slideshow ? 'aspect-video' : jenisWork ? 'aspect-square' : 'aspect-[3/4]'

    const { data, setData, post, processing, errors, progress } = useForm({
        jenis,
        judul: work.judul ?? '',
        lokasi: work.lokasi ?? '',
        category_id: work.category_id ?? '',
        ukuran: work.ukuran ?? 'sedang',
        urutan: work.urutan ?? 0,
        foto: null,
    })

    const kirim = (e) => {
        e.preventDefault()
        post(`/admin/works/${work.id}`, { forceFormData: true })
    }

    const labelFoto = slideshow
        ? 'Ganti foto slide show'
        : horizontal
          ? 'Ganti foto strip horizontal'
          : 'Ganti foto halaman Works'

    return (
        <AdminLayout>
            <Head title={`Ubah ${labelJenis?.[jenis] ?? 'Data'}`} />

            <PageHeader
                judul={`Ubah ${labelJenis?.[jenis] ?? 'Data'}`}
                catatan="Kosongkan kolom foto kalau kamu tidak ingin menggantinya."
                aksi={<LinkButton href={`/admin/works?jenis=${jenis}`}>Kembali</LinkButton>}
            />

            <form onSubmit={kirim} className="max-w-2xl">
                <Card className="space-y-5">
                    {slideshow ? null : (
                        <>
                            <Field
                                label="Judul"
                                wajib
                                error={errors.judul}
                                petunjuk="Slug halaman ikut diperbarui saat judul diubah."
                            >
                                <TextInput
                                    type="text"
                                    value={data.judul}
                                    onChange={(e) => setData('judul', e.target.value)}
                                />
                            </Field>

                            <Field label="Lokasi" wajib error={errors.lokasi}>
                                <TextInput
                                    type="text"
                                    value={data.lokasi}
                                    onChange={(e) => setData('lokasi', e.target.value)}
                                />
                            </Field>
                        </>
                    )}

                    {jenisWork ? (
                        <Field
                            label="Kategori"
                            wajib
                            error={errors.category_id}
                            petunjuk="Dipakai oleh dropdown filter kategori di halaman Works."
                        >
                            <SelectInput
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
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

                    <div>
                        <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-muted">
                            Foto sekarang
                        </span>
                        <Thumb src={work.thumb} alt={work.judul ?? ''} ratio={rasio} />
                    </div>

                    <Field
                        label={labelFoto}
                        error={errors.foto}
                        petunjuk="Biarkan kosong kalau foto lama tetap dipakai. Maksimal 12 MB."
                    >
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
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? 'Menyimpan' : 'Simpan perubahan'}
                        </PrimaryButton>
                        <LinkButton href={`/admin/works?jenis=${jenis}`}>Batal</LinkButton>
                    </div>
                </Card>
            </form>
        </AdminLayout>
    )
}