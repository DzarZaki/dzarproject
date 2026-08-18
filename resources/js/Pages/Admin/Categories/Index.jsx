import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { EmptyState, LinkButton, PageHeader, PrimaryButton, TableCard, THead, Thumb } from '@/Components/Admin/ui'

export default function CategoriesIndex({ categories }) {
    const hapus = (c) => {
        if (!window.confirm(`Hapus kategori ${c.nama}?`)) return
        router.delete(`/admin/categories/${c.id}`, { preserveScroll: true })
    }

    return (
        <AdminLayout>
            <Head title="Kategori" />

            <PageHeader
                judul="Kategori"
                catatan="Foto lanskap di sini hanya pajangan di landing page dan tidak ikut tampil di halaman Works. Fungsinya sebagai pintu masuk: saat diklik, pengunjung dibawa ke halaman Works yang sudah tersaring sesuai kategori."
                aksi={
                    <Link href="/admin/categories/create">
                        <PrimaryButton type="button">Tambah</PrimaryButton>
                    </Link>
                }
            />

            {categories.length === 0 ? (
                <EmptyState
                    judul="Belum ada kategori"
                    catatan="Buat kategori dulu, misalnya Wisuda dan Prewedding. Foto kategori tidak dihitung sebagai work, jadi pilih foto yang paling enak dilihat saja."
                    aksi={
                        <Link href="/admin/categories/create">
                            <PrimaryButton type="button">Tambah kategori</PrimaryButton>
                        </Link>
                    }
                />
            ) : (
                <TableCard>
                    <THead kolom={['Foto pajangan', 'Nama', 'Slug', 'Jumlah work', 'Urutan', 'Aksi']} />
                    <tbody>
                        {categories.map((c) => (
                            <tr key={c.id} className="border-b border-line last:border-0">
                                <td className="px-4 py-3">
                                    <Thumb src={c.thumb_url} alt={c.nama} ratio="aspect-video" />
                                </td>
                                <td className="px-4 py-3 text-ink">{c.nama}</td>
                                <td className="px-4 py-3 text-muted">{c.slug}</td>
                                <td className="px-4 py-3 text-muted">{c.jumlah_work}</td>
                                <td className="px-4 py-3 text-muted">{c.urutan}</td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <LinkButton href={`/admin/categories/${c.id}/edit`}>Ubah</LinkButton>
                                        <button
                                            type="button"
                                            onClick={() => hapus(c)}
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