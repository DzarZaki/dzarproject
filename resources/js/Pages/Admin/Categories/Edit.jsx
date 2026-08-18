import { Head, Link, useForm } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { Card, Field, FileInput, GhostButton, PageHeader, PrimaryButton, TextInput, Thumb } from '@/Components/Admin/ui'

export default function CategoryEdit({ category }) {
    const form = useForm({ nama: category.nama ?? '', urutan: category.urutan ?? 0, thumb: null })

    const kirim = (e) => {
        e.preventDefault()
        form.post(`/admin/categories/${category.id}`, { forceFormData: true })
    }

    return (
        <AdminLayout>
            <Head title={`Ubah ${category.nama}`} />

            <PageHeader
                judul="Ubah kategori"
                catatan="Foto pajangan tidak ikut tampil di halaman Works."
                aksi={
                    <Link href="/admin/categories">
                        <GhostButton type="button">Kembali</GhostButton>
                    </Link>
                }
            />

            <Card className="max-w-xl">
                <form onSubmit={kirim} className="space-y-5">
                    <Field label="Nama kategori" wajib error={form.errors.nama}>
                        <TextInput value={form.data.nama} onChange={(e) => form.setData('nama', e.target.value)} />
                    </Field>

                    <Field label="Urutan tampil" error={form.errors.urutan}>
                        <TextInput
                            type="number"
                            min="0"
                            value={form.data.urutan}
                            onChange={(e) => form.setData('urutan', e.target.value)}
                        />
                    </Field>

                    <div>
                        <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-muted">Foto sekarang</span>
                        <Thumb src={category.thumb_url} alt={category.nama} ratio="aspect-video" />
                    </div>

                    <Field
                        label="Ganti foto pajangan (lanskap)"
                        error={form.errors.thumb}
                        petunjuk="Opsional. Pakai foto lanskap."
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
                        {form.processing ? 'Menyimpan' : 'Simpan perubahan'}
                    </PrimaryButton>
                </form>
            </Card>
        </AdminLayout>
    )
}