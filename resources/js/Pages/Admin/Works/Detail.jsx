import { Head, Link, router, useForm } from '@inertiajs/react'
import { useMemo, useState } from 'react'
import AdminLayout from '@/Layouts/AdminLayout'
import {
    Card,
    DangerButton,
    Field,
    FileInput,
    GhostButton,
    PageHeader,
    PrimaryButton,
    SelectInput,
    TextInput,
    AreaInput,
    Thumb,
} from '@/Components/Admin/ui'

export default function WorkDetail({ work, categories }) {
    const [kunciZigzag, setKunciZigzag] = useState(0)

    const utama = useForm({
        judul: work.judul ?? '',
        lokasi: work.lokasi ?? '',
        category_id: work.category_id ?? '',
        deskripsi: work.deskripsi ?? '',
        youtube_url: work.youtube_url ?? '',
        cover: null,
    })

    const unggah = useForm({ foto: [] })
    const drive = useForm({ link: '' })

    const galatFoto = useMemo(() => {
        const kunci = Object.keys(unggah.errors).filter((k) => k === 'foto' || k.startsWith('foto.'))
        return kunci.length > 0 ? unggah.errors[kunci[0]] : null
    }, [unggah.errors])

    const simpanUtama = (e) => {
        e.preventDefault()
        utama.post(`/admin/works/${work.id}/detail`, { forceFormData: true, preserveScroll: true })
    }

    const kirimZigzag = (e) => {
        e.preventDefault()
        unggah.post(`/admin/works/${work.id}/zigzag`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                unggah.setData('foto', [])
                setKunciZigzag((n) => n + 1)
            },
        })
    }

    const kirimDrive = (e) => {
        e.preventDefault()
        drive.post(`/admin/works/${work.id}/zigzag/drive`, {
            preserveScroll: true,
            onSuccess: () => drive.reset('link'),
        })
    }

    const geser = (indeks, arah) => {
        const tujuan = indeks + arah
        if (tujuan < 0 || tujuan >= work.zigzag.length) return

        const daftar = work.zigzag.map((f) => f.id)
        const simpan = daftar[indeks]
        daftar[indeks] = daftar[tujuan]
        daftar[tujuan] = simpan

        router.post(`/admin/works/${work.id}/zigzag/urut`, { urutan: daftar }, { preserveScroll: true })
    }

    const hapusFoto = (id) => {
        if (!window.confirm('Hapus foto ini?')) return
        router.delete(`/admin/photos/${id}`, { preserveScroll: true })
    }

    return (
        <AdminLayout>
            <Head title={`Detail ${work.judul ?? ''}`} />

            <PageHeader
                judul="Halaman detail"
                catatan="Isi bagian ini supaya halaman detail publik tampil lengkap: cover, video YouTube, dan rangkaian foto zigzag."
                aksi={
                    <Link href={`/admin/works?jenis=${work.jenis}`}>
                        <GhostButton type="button">Kembali</GhostButton>
                    </Link>
                }
            />

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <Card>
                    <h2 className="mb-5 text-[11px] uppercase tracking-[0.14em] text-muted">Data halaman detail</h2>

                    <form onSubmit={simpanUtama} className="space-y-5">
                        <Field label="Judul" wajib error={utama.errors.judul}>
                            <TextInput value={utama.data.judul} onChange={(e) => utama.setData('judul', e.target.value)} />
                        </Field>

                        <Field label="Lokasi" wajib error={utama.errors.lokasi}>
                            <TextInput value={utama.data.lokasi} onChange={(e) => utama.setData('lokasi', e.target.value)} />
                        </Field>

                        <Field
                            label="Kategori"
                            error={utama.errors.category_id}
                            petunjuk="Kategori dipakai carousel di landing page dan filter halaman Works."
                        >
                            <SelectInput
                                value={utama.data.category_id ?? ''}
                                onChange={(e) => utama.setData('category_id', e.target.value)}
                            >
                                <option value="">Tanpa kategori</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.nama}
                                    </option>
                                ))}
                            </SelectInput>
                        </Field>

                        <Field label="Deskripsi" error={utama.errors.deskripsi} petunjuk="Opsional.">
                            <AreaInput
                                value={utama.data.deskripsi ?? ''}
                                onChange={(e) => utama.setData('deskripsi', e.target.value)}
                            />
                        </Field>

                        <Field
                            label="Link YouTube"
                            error={utama.errors.youtube_url}
                            petunjuk="Opsional. Boleh link watch, youtu.be, atau shorts."
                        >
                            <TextInput
                                value={utama.data.youtube_url ?? ''}
                                onChange={(e) => utama.setData('youtube_url', e.target.value)}
                                placeholder="Tempel link video di sini"
                            />
                        </Field>

                        <div>
                            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-muted">Cover sekarang</span>
                            <Thumb src={work.cover?.thumb} alt="Cover" ratio="aspect-video" />
                        </div>

                        <Field
                            label="Foto cover halaman detail"
                            error={utama.errors.cover}
                            petunjuk="Foto ini berbeda dari foto yang tampil di landing page. Mengunggah baru akan menggantikan cover lama."
                        >
                            <FileInput
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => utama.setData('cover', e.target.files?.[0] ?? null)}
                            />
                        </Field>

                        {utama.progress ? (
                            <div className="h-0.5 w-full overflow-hidden rounded bg-line">
                                <div className="h-full bg-ink transition-all" style={{ width: `${utama.progress.percentage}%` }} />
                            </div>
                        ) : null}

                        <PrimaryButton type="submit" disabled={utama.processing}>
                            {utama.processing ? 'Menyimpan' : 'Simpan'}
                        </PrimaryButton>
                    </form>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <h2 className="mb-4 text-[11px] uppercase tracking-[0.14em] text-muted">Tambah foto zigzag</h2>

                        <form onSubmit={kirimZigzag} className="space-y-4">
                            <Field
                                label="Pilih foto"
                                error={galatFoto}
                                petunjuk="Boleh pilih banyak sekaligus, maksimal 20 per unggahan. Jumlah total tidak dibatasi."
                            >
                                <FileInput
                                    key={kunciZigzag}
                                    multiple
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={(e) => unggah.setData('foto', Array.from(e.target.files ?? []))}
                                />
                            </Field>

                            {unggah.progress ? (
                                <div className="h-0.5 w-full overflow-hidden rounded bg-line">
                                    <div className="h-full bg-ink transition-all" style={{ width: `${unggah.progress.percentage}%` }} />
                                </div>
                            ) : null}

                            <PrimaryButton type="submit" disabled={unggah.processing || unggah.data.foto.length === 0}>
                                {unggah.processing ? 'Mengunggah' : `Unggah ${unggah.data.foto.length || ''}`.trim()}
                            </PrimaryButton>
                        </form>
                    </Card>

                    <Card>
                        <h2 className="mb-4 text-[11px] uppercase tracking-[0.14em] text-muted">Ambil dari Google Drive</h2>

                        <form onSubmit={kirimDrive} className="space-y-4">
                            <Field label="Link Drive" error={drive.errors.link} petunjuk="Pastikan aksesnya publik.">
                                <TextInput value={drive.data.link} onChange={(e) => drive.setData('link', e.target.value)} />
                            </Field>

                            <GhostButton type="submit" disabled={drive.processing}>
                                {drive.processing ? 'Mengambil' : 'Ambil foto'}
                            </GhostButton>
                        </form>
                    </Card>
                </div>
            </div>

            <div className="mt-10">
                <h2 className="mb-4 text-[11px] uppercase tracking-[0.14em] text-muted">
                    Foto zigzag ({work.zigzag.length})
                </h2>

                {work.zigzag.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-line bg-white px-6 py-12 text-center text-sm text-muted">
                        Belum ada foto zigzag. Foto pertama akan tampil rata kiri, berikutnya rata kanan, bergantian.
                    </div>
                ) : (
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {work.zigzag.map((f, i) => (
                            <li key={f.id} className="overflow-hidden rounded-xl border border-line bg-white">
                                <div className="aspect-[4/5] bg-bone">
                                    <img src={f.thumb} alt="" loading="lazy" className="h-full w-full object-cover" />
                                </div>

                                <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                                    <span className="text-[11px] uppercase tracking-[0.12em] text-muted">
                                        {i % 2 === 0 ? 'Kiri' : 'Kanan'} · {i + 1}
                                    </span>

                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => geser(i, -1)}
                                            disabled={i === 0}
                                            className="rounded border border-line px-2 py-1 text-xs text-ink transition-colors hover:border-ink/40 disabled:opacity-30"
                                            aria-label="Naikkan urutan"
                                        >
                                            ↑
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => geser(i, 1)}
                                            disabled={i === work.zigzag.length - 1}
                                            className="rounded border border-line px-2 py-1 text-xs text-ink transition-colors hover:border-ink/40 disabled:opacity-30"
                                            aria-label="Turunkan urutan"
                                        >
                                            ↓
                                        </button>
                                        <DangerButton type="button" onClick={() => hapusFoto(f.id)}>
                                            Hapus
                                        </DangerButton>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </AdminLayout>
    )
}