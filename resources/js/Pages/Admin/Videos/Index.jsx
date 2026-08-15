import { EmptyState, PageHeader, PrimaryButton, TableCard, THead } from '@/Components/Admin/ui';
import ConfirmModal from '@/Components/ConfirmModal';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ videos }) {
    const [target, setTarget] = useState(null);

    function hapus() {
        router.delete(`/admin/videos/${target.id}`, {
            onFinish: () => setTarget(null),
        });
    }

    return (
        <AdminLayout>
            <PageHeader judul="Videos" deskripsi="Link YouTube untuk section Videos di landing page.">
                <PrimaryButton onClick={() => router.get('/admin/videos/create')}>
                    + Tambah Video
                </PrimaryButton>
            </PageHeader>

            <div className="mt-6">
                <TableCard>
                    <THead>
                        <th className="px-4 py-3 font-medium">Video</th>
                        <th className="px-4 py-3 font-medium">Judul</th>
                        <th className="px-4 py-3 font-medium">Urutan</th>
                        <th className="px-4 py-3 text-right font-medium">Aksi</th>
                    </THead>
                    <tbody>
                        {videos.map((video) => {
                            const videoId = video.embed_url?.split('/').pop();

                            return (
                                <tr key={video.id} className="border-b border-line last:border-0">
                                    <td className="px-4 py-3">
                                        {videoId ? (
                                            <img
                                                src={`{{https://img.youtube.com/vi/${videoId}}}/default.jpg`}
                                                alt=""
                                                loading="lazy"
                                                className="h-12 w-20 rounded-sm border border-line object-cover"
                                            />
                                        ) : (
                                            <span className="text-xs text-red-700">Link tidak dikenali</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-ink">{video.judul || '(tanpa judul)'}</div>
                                        <div className="max-w-xs truncate text-xs text-muted">
                                            {video.youtube_url}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-muted">{video.urutan}</td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            href={`/admin/videos/${video.id}/edit`}
                                            className="mr-3 text-ink underline"
                                        >
                                            Ubah
                                        </Link>
                                        <button
                                            onClick={() => setTarget(video)}
                                            className="text-red-700 underline"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </TableCard>
                {videos.length === 0 && <EmptyState>Belum ada video. Tambahkan link YouTube pertama.</EmptyState>}
            </div>

            <ConfirmModal
                open={target !== null}
                judul="Hapus Video"
                pesan={`Yakin ingin menghapus video "${target?.judul || target?.youtube_url}" dari landing page?`}
                onConfirm={hapus}
                onClose={() => setTarget(null)}
            />
        </AdminLayout>
    );
}