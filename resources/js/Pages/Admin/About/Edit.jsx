import { Head, useForm } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { AreaInput, Card, Field, FileInput, PageHeader, PrimaryButton, TextInput } from '@/Components/Admin/ui'

export default function AboutEdit({ about }) {
    const form = useForm({
        label: about.label ?? 'About Us',
        judul: about.judul ?? '',
        paragraf_1: about.paragraf_1 ?? '',
        paragraf_2: about.paragraf_2 ?? '',
        foto_portrait: null,
        foto_full: null,
        foto_pita: null,
    })

    const kirim = (e) => {
        e.preventDefault()
        form.post('/admin/about', { forceFormData: true, preserveScroll: true })
    }

    return (
        <AdminLayout>
            <Head title="About" />

            <PageHeader
                judul="Halaman About"
                catatan="Halaman About punya dua bagian: baris tiga kolom di atas, lalu satu foto lebar selebar layar. Di bawahnya ada satu foto khusus untuk landing page."
            />

            <form onSubmit={kirim} className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <h2 className="mb-5 text-[11px] uppercase tracking-[0.14em] text-muted">Bagian satu</h2>

                    <div className="space-y-5">
                        <Field label="Label kecil" wajib error={form.errors.label} petunjuk="Tampil kecil di kiri atas.">
                            <TextInput value={form.data.label} onChange={(e) => form.setData('label', e.target.value)} />
                        </Field>

                        <Field label="Judul section" wajib error={form.errors.judul}>
                            <TextInput value={form.data.judul} onChange={(e) => form.setData('judul', e.target.value)} />
                        </Field>

                        <Field label="Paragraf pertama" wajib error={form.errors.paragraf_1}>
                            <AreaInput
                                rows={6}
                                value={form.data.paragraf_1}
                                onChange={(e) => form.setData('paragraf_1', e.target.value)}
                            />
                        </Field>

                        <Field label="Paragraf kedua" error={form.errors.paragraf_2} petunjuk="Opsional.">
                            <AreaInput
                                rows={6}
                                value={form.data.paragraf_2 ?? ''}
                                onChange={(e) => form.setData('paragraf_2', e.target.value)}
                            />
                        </Field>
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <h2 className="mb-5 text-[11px] uppercase tracking-[0.14em] text-muted">Foto portrait kecil</h2>

                        {about.portrait_url ? (
                            <div className="mb-4 w-36 overflow-hidden rounded-md border border-line bg-bone">
                                <img src={about.portrait_url} alt="" className="aspect-[4/5] w-full object-cover" />
                            </div>
                        ) : (
                            <div className="mb-4 aspect-[4/5] w-36 rounded-md border border-dashed border-line bg-bone" />
                        )}

                        <Field
                            label="Ganti foto portrait"
                            error={form.errors.foto_portrait}
                            petunjuk="Perbandingan sisi kira kira 4:5. Tampil di halaman About."
                        >
                            <FileInput
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => form.setData('foto_portrait', e.target.files?.[0] ?? null)}
                            />
                        </Field>
                    </Card>

                    <Card>
                        <h2 className="mb-5 text-[11px] uppercase tracking-[0.14em] text-muted">Foto lebar bagian dua</h2>

                        {about.full_url ? (
                            <div className="mb-4 overflow-hidden rounded-md border border-line bg-bone">
                                <img src={about.full_url} alt="" className="aspect-[16/7] w-full object-cover grayscale" />
                            </div>
                        ) : (
                            <div className="mb-4 aspect-[16/7] w-full rounded-md border border-dashed border-line bg-bone" />
                        )}

                        <Field
                            label="Ganti foto lebar"
                            error={form.errors.foto_full}
                            petunjuk="Foto lanskap resolusi besar. Tampil hitam putih selebar layar di halaman About."
                        >
                            <FileInput
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => form.setData('foto_full', e.target.files?.[0] ?? null)}
                            />
                        </Field>
                    </Card>

                    <Card>
                        <h2 className="mb-2 text-[11px] uppercase tracking-[0.14em] text-muted">
                            Foto memanjang untuk landing page
                        </h2>

                        <p className="mb-5 text-xs leading-relaxed text-muted">
                            Foto ini tidak tampil di halaman About. Tempatnya di halaman depan, tepat di antara bagian
                            kategori dan bagian video, ditampilkan hitam putih selebar layar. Pakai foto lanskap yang
                            sangat lebar supaya bagian atas dan bawahnya tidak terpotong banyak.
                        </p>

                        {about.pita_url ? (
                            <div className="mb-4 overflow-hidden rounded-md border border-line bg-bone">
                                <img src={about.pita_url} alt="" className="aspect-[21/9] w-full object-cover grayscale" />
                            </div>
                        ) : (
                            <div className="mb-4 aspect-[21/9] w-full rounded-md border border-dashed border-line bg-bone" />
                        )}

                        <Field
                            label="Ganti foto memanjang landing page"
                            error={form.errors.foto_pita}
                            petunjuk="Perbandingan sisi paling cocok sekitar 21:9. Kalau dibiarkan kosong, bagian ini tidak muncul di landing page."
                        >
                            <FileInput
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => form.setData('foto_pita', e.target.files?.[0] ?? null)}
                            />
                        </Field>
                    </Card>

                    {form.progress ? (
                        <div className="h-0.5 w-full overflow-hidden rounded bg-line">
                            <div className="h-full bg-ink transition-all" style={{ width: `${form.progress.percentage}%` }} />
                        </div>
                    ) : null}

                    <PrimaryButton type="submit" disabled={form.processing}>
                        {form.processing ? 'Menyimpan' : 'Simpan halaman About'}
                    </PrimaryButton>
                </div>
            </form>
        </AdminLayout>
    )
}