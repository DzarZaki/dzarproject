import { EmptyState, PageHeader, PrimaryButton, TableCard, THead } from '@/Components/Admin/ui';
import ConfirmModal from '@/Components/ConfirmModal';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ works }) {
    const [target, setTarget] = useState(null);

    function hapus() {
        router.delete(`/admin/works/${target.id}`, {
            onFinish: () => setTarget(null),
        });
    }

    return (
        <AdminLayout>
            <PageHeader judul="Works" deskripsi="Kelola karya portofolio (1 work = 1 sesi/album).">
                <PrimaryButton onClick={() => router.get('/admin/works/create')}>
                    + Tambah Work
                </PrimaryButton>
            </PageHeader>

            <div className="mt-6">
                <TableCard>
                    <THead>
                        <th className="px-4 py-3 font-medium">Judul</th>
                        <th className="px-4 py-3 font-medium">Kategori</th>
                        <th className="px-4 py-3 font-medium">Foto</th>
                        <th className="px-4 py-3 font-medium">Di Landing</th>
                        <th className="px-4 py-3 text-right font-medium">Aksi</th>
                    </THead>
                    <tbody>
                        {works.map((work) => (
                            <tr key={work.id} className="border-b border-line last:border-0">
                                <td className="px-4 py-3">
                                    <div className="font-medium text-ink">{work.judul}</div>
                                    <div className="text-xs text-muted">/{work.slug}</div>
                                </td>
                                <td className="px-4 py-3 text-muted">{work.category.nama}</td>
                                <td className="px-4 py-3 text-muted">{work.photos_count}</td>
                                <td className="px-4 py-3">
                                    {work.show_on_landing ? (
                                        <span className="rounded-full bg-[#EDF3EC] px-2 py-1 text-xs tracking-wide text-[#346538]">
                                            Ya
                                        </span>
                                    ) : (
                                        <span className="rounded-full bg-bone px-2 py-1 text-xs tracking-wide text-muted">
                                            Tidak
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <Link
                                        href={`/admin/works/${work.id}/photos`}
                                        className="mr-3 text-ink underline"
                                    >
                                        Foto
                                    </Link>
                                    <Link
                                        href={`/admin/works/${work.id}/edit`}
                                        className="mr-3 text-ink underline"
                                    >
                                        Ubah
                                    </Link>
                                    <button
                                        onClick={() => setTarget(work)}
                                        className="text-red-700 underline"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </TableCard>
                {works.length === 0 && <EmptyState>Belum ada work. Tambahkan yang pertama.</EmptyState>}
            </div>

            <ConfirmModal
                open={target !== null}
                judul="Hapus Work"
                pesan={`Yakin ingin menghapus work "${target?.judul}"? Semua foto di dalamnya ikut terhapus.`}
                onConfirm={hapus}
                onClose={() => setTarget(null)}
            />
        </AdminLayout>
    );
}