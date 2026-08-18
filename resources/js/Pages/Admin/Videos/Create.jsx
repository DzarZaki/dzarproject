import { Head, Link, useForm } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { Card, Field, GhostButton, PageHeader, PrimaryButton, TextInput } from '@/Components/Admin/ui'

export default function VideoCreate({ urutanBerikutnya }) {
    const form = useForm({ judul: '', youtube_url: '', urutan: urutanBerikutnya })

    const kirim = (e) => {
        e.preventDefault()
        form.post('/admin/videos')
    }

    return (
        <AdminLayout>
            <Head title="Tambah video" />

            <PageHeader
                judul="Tambah video"
                aksi={
                    <Link href="/admin/videos">
                        <GhostButton type="button">Kembali</GhostButton>
                    </Link>
                }
            />

            <Card className="max-w-xl">
                <form onSubmit={kirim} className="space-y-5">
                    <Field label="Judul" error={form.errors.judul} petunjuk="Opsional, hanya dipakai di halaman admin.">
                        <TextInput value={form.data.judul} onChange={(e) => form.setData('judul', e.target.value)} />
                    </Field>

                    <Field
                        label="Link YouTube"
                        wajib
                        error={form.errors.youtube_url}
                        petunjuk="Boleh link watch, youtu.be, atau shorts."
                    >
                        <TextInput
                            value={form.data.youtube_url}
                            onChange={(e) => form.setData('youtube_url', e.target.value)}
                            placeholder="Tempel link video di sini"
                        />
                    </Field>

                    <Field label="Urutan tampil" error={form.errors.urutan}>
                        <TextInput
                            type="number"
                            min="0"
                            value={form.data.urutan}
                            onChange={(e) => form.setData('urutan', e.target.value)}
                        />
                    </Field>

                    <PrimaryButton type="submit" disabled={form.processing}>
                        {form.processing ? 'Menyimpan' : 'Simpan'}
                    </PrimaryButton>
                </form>
            </Card>
        </AdminLayout>
    )
}