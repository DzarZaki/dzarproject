import { EmptyState, PageHeader, PrimaryButton, TableCard, THead } from '@/Components/Admin/ui';
import ConfirmModal from '@/Components/ConfirmModal';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ categories }) {
    const { errors } = usePage().props;
    const [target, setTarget] = useState(null);

    function hapus() {
        router.delete(`/admin/categories/${target.id}`, {
            onFinish: () => setTarget(null),
        });
    }

    return (
        <AdminLayout>
            <PageHeader judul="Kategori" deskripsi="Kelola kategori portofolio.">
                <PrimaryButton onClick={() => router.get('/admin/categories/create')}>
                    + Tambah Kategori
                </PrimaryButton>
            </PageHeader>

            {errors.delete && (
                <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errors.delete}
                </div>
            )}

            <div className="mt-6">
                <TableCard>
                    <THead>
                        <th className="px-4 py-3 font-medium">Nama</th>
                        <th className="px-4 py-3 font-medium">Slug</th>
                        <th className="px-4 py-3 font-medium">Jumlah Work</th>
                        <th className="px-4 py-3 text-right font-medium">Aksi</th>
                    </THead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id} className="border-b border-line last:border-0">
                                <td className="px-4 py-3 text-ink">{category.nama}</td>
                                <td className="px-4 py-3 text-muted">{category.slug}</td>
                                <td className="px-4 py-3 text-muted">{category.works_count}</td>
                                <td className="px-4 py-3 text-right">
                                    <Link
                                        href={`/admin/categories/${category.id}/edit`}
                                        className="mr-3 text-ink underline"
                                    >
                                        Ubah
                                    </Link>
                                    <button
                                        onClick={() => setTarget(category)}
                                        className="text-red-700 underline"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </TableCard>
                {categories.length === 0 && <EmptyState>Belum ada kategori. Tambahkan yang pertama.</EmptyState>}
            </div>

            <ConfirmModal
                open={target !== null}
                judul="Hapus Kategori"
                pesan={`Yakin ingin menghapus kategori "${target?.nama}"? Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={hapus}
                onClose={() => setTarget(null)}
            />
        </AdminLayout>
    );
}