import { Head, Link, useForm } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { Card, Field, GhostButton, PageHeader, PrimaryButton, TextInput } from '@/Components/Admin/ui'

export default function VideoEdit({ video }) {
    const form = useForm({
        judul: video.judul ?? '',
        youtube_url: video.youtube_url ?? '',
        urutan: video.urutan ?? 0,
    })

    const kirim = (e) => {
        e.preventDefault()
        form.put(`/admin/videos/${video.id}`)
    }

    return (
        <AdminLayout>
            <Head title="Ubah video" />

            <PageHeader
                judul="Ubah video"
                aksi={
                    <Link href="/admin/videos">
                        <GhostButton type="button">Kembali</GhostButton>
                    </Link>
                }
            />

            <Card className="max-w-xl">
                <form onSubmit={kirim} className="space-y-5">
                    <Field label="Judul" error={form.errors.judul}>
                        <TextInput value={form.data.judul} onChange={(e) => form.setData('judul', e.target.value)} />
                    </Field>

                    <Field label="Link YouTube" wajib error={form.errors.youtube_url}>
                        <TextInput
                            value={form.data.youtube_url}
                            onChange={(e) => form.setData('youtube_url', e.target.value)}
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
                        {form.processing ? 'Menyimpan' : 'Simpan perubahan'}
                    </PrimaryButton>
                </form>
            </Card>
        </AdminLayout>
    )
}