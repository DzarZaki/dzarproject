import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { EmptyState, LinkButton, PageHeader, PrimaryButton, TableCard, THead } from '@/Components/Admin/ui'

export default function VideosIndex({ videos }) {
    const hapus = (v) => {
        if (!window.confirm('Hapus video ini?')) return
        router.delete(`/admin/videos/${v.id}`, { preserveScroll: true })
    }

    return (
        <AdminLayout>
            <Head title="Video" />

            <PageHeader
                judul="Video"
                catatan="Video main sendiri tanpa suara begitu pengunjung sampai ke section Videos, lalu berhenti saat digulir keluar layar."
                aksi={
                    <Link href="/admin/videos/create">
                        <PrimaryButton type="button">Tambah</PrimaryButton>
                    </Link>
                }
            />

            {videos.length === 0 ? (
                <EmptyState
                    judul="Belum ada video"
                    catatan="Tempel link YouTube untuk mengisi section Videos di landing page."
                    aksi={
                        <Link href="/admin/videos/create">
                            <PrimaryButton type="button">Tambah video</PrimaryButton>
                        </Link>
                    }
                />
            ) : (
                <TableCard>
                    <THead kolom={['Pratinjau', 'Judul', 'Link', 'Urutan', 'Aksi']} />
                    <tbody>
                        {videos.map((v) => (
                            <tr key={v.id} className="border-b border-line last:border-0">
                                <td className="px-4 py-3">
                                    <div className="aspect-video w-32 overflow-hidden rounded-md border border-line bg-bone">
                                        {v.embed_url ? (
                                            <iframe
                                                src={v.embed_url}
                                                title={v.judul ?? 'Video'}
                                                loading="lazy"
                                                className="h-full w-full"
                                                allow="encrypted-media; picture-in-picture"
                                            />
                                        ) : null}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-ink">{v.judul ?? 'Tanpa judul'}</td>
                                <td className="max-w-xs truncate px-4 py-3 text-muted">{v.youtube_url}</td>
                                <td className="px-4 py-3 text-muted">{v.urutan}</td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <LinkButton href={`/admin/videos/${v.id}/edit`}>Ubah</LinkButton>
                                        <button
                                            type="button"
                                            onClick={() => hapus(v)}
                                            className="rounded-lg border border-red-200 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-red-700 transition-colors duration-150 hover:border-red-400"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </TableCard>
            )}
        </AdminLayout>
    )
}