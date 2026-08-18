import { Head, Link, useForm } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { Card, Field, FileInput, GhostButton, PageHeader, PrimaryButton, TextInput } from '@/Components/Admin/ui'

export default function CategoryCreate({ urutanBerikutnya }) {
    const form = useForm({ nama: '', urutan: urutanBerikutnya, thumb: null })

    const kirim = (e) => {
        e.preventDefault()
        form.post('/admin/categories', { forceFormData: true })
    }

    return (
        <AdminLayout>
            <Head title="Tambah kategori" />

            <PageHeader
                judul="Tambah kategori"
                catatan="Foto yang diunggah di sini hanya jadi pajangan di landing page, bukan bagian dari halaman Works."
                aksi={
                    <Link href="/admin/categories">
                        <GhostButton type="button">Kembali</GhostButton>
                    </Link>
                }
            />

            <Card className="max-w-xl">
                <form onSubmit={kirim} className="space-y-5">
                    <Field
                        label="Nama kategori"
                        wajib
                        error={form.errors.nama}
                        petunjuk="Nama ini yang ditulis di tengah foto dan jadi penyaring halaman Works."
                    >
                        <TextInput
                            value={form.data.nama}
                            onChange={(e) => form.setData('nama', e.target.value)}
                            placeholder="Contoh: Wisuda"
                        />
                    </Field>

                    <Field label="Urutan tampil" error={form.errors.urutan} petunjuk="Angka kecil tampil lebih dulu.">
                        <TextInput
                            type="number"
                            min="0"
                            value={form.data.urutan}
                            onChange={(e) => form.setData('urutan', e.target.value)}
                        />
                    </Field>

                    <Field
                        label="Foto pajangan (lanskap)"
                        wajib
                        error={form.errors.thumb}
                        petunjuk="Pakai foto lanskap. Foto ini tidak muncul di halaman Works, hanya jadi kartu di landing page yang mengarahkan ke Works."
                    >
                        <FileInput
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => form.setData('thumb', e.target.files?.[0] ?? null)}
                        />
                    </Field>

                    {form.progress ? (
                        <div className="h-0.5 w-full overflow-hidden rounded bg-line">
                            <div className="h-full bg-ink transition-all" style={{ width: `${form.progress.percentage}%` }} />
                        </div>
                    ) : null}

                    <PrimaryButton type="submit" disabled={form.processing}>
                        {form.processing ? 'Menyimpan' : 'Simpan'}
                    </PrimaryButton>
                </form>
            </Card>
        </AdminLayout>
    )
}