import { Card, EmptyState, PageHeader, PrimaryButton } from '@/Components/Admin/ui';
import ConfirmModal from '@/Components/ConfirmModal';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const PERAN_LABEL = {
    cover: 'Cover',
    landing_typography: 'Landing — Tipografi',
    landing_strip: 'Landing — Strip Horizontal',
    detail: 'Detail (zig-zag)',
};

export default function Photos({ work }) {
    const { errors } = usePage().props;
    const [target, setTarget] = useState(null);

    const upload = useForm({ foto: [] });
    const drive = useForm({ gdrive_link: '' });

    function submitUpload(e) {
        e.preventDefault();
        upload.post(`/admin/works/${work.id}/photos`, {
            forceFormData: true,
            onSuccess: () => upload.reset(),
        });
    }

    function submitDrive(e) {
        e.preventDefault();
        drive.post(`/admin/works/${work.id}/photos/drive`, {
            onSuccess: () => drive.reset(),
        });
    }

    function ubahPeran(photo, peran) {
        router.patch(`/admin/photos/${photo.id}`, { peran, urutan: photo.urutan });
    }

    function ubahUrutan(photo, urutan) {
        router.patch(`/admin/photos/${photo.id}`, { peran: photo.peran, urutan: Number(urutan) });
    }

    function hapus() {
        router.delete(`/admin/photos/${target.id}`, {
            onFinish: () => setTarget(null),
        });
    }

    return (
        <AdminLayout>
            <Link href="/admin/works" className="text-sm text-muted hover:text-ink">
                ← Kembali ke Works
            </Link>

            <div className="mt-3">
                <PageHeader
                    judul={`Foto: ${work.judul}`}
                    deskripsi="Upload banyak foto sekaligus, atau tempel link Google Drive. Semua foto otomatis menjadi WebP + thumbnail."
                />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Card className="p-6">
                    <form onSubmit={submitUpload}>
                        <p className="text-sm font-medium text-ink">Upload foto (bisa banyak, maks 20)</p>
                        <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => upload.setData('foto', Array.from(e.target.files))}
                            className="mt-3 block w-full text-sm text-muted"
                        />
                        {errors.foto && <p className="mt-1 text-sm text-red-700">{errors.foto}</p>}
                        {errors['foto.0'] && <p className="mt-1 text-sm text-red-700">{errors['foto.0']}</p>}
                        <PrimaryButton
                            type="submit"
                            disabled={upload.processing || upload.data.foto.length === 0}
                            className="mt-4"
                        >
                            {upload.processing ? 'Mengunggah…' : 'Unggah'}
                        </PrimaryButton>
                    </form>
                </Card>

                <Card className="p-6">
                    <form onSubmit={submitDrive}>
                        <p className="text-sm font-medium text-ink">Atau tempel link Google Drive</p>
                        <div className="mt-3 flex gap-2">
                            <input
                                type="url"
                                value={drive.data.gdrive_link}
                                onChange={(e) => drive.setData('gdrive_link', e.target.value)}
                                placeholder="https://drive.google.com/file/d/…"
                                className="w-full rounded-md border border-line px-3 py-2 text-sm transition-colors duration-150 focus:border-ink focus:outline-none"
                            />
                            <PrimaryButton type="submit" disabled={drive.processing}>
                                {drive.processing ? 'Mengambil…' : 'Ambil'}
                            </PrimaryButton>
                        </div>
                        {errors.gdrive_link && (
                            <p className="mt-1 text-sm text-red-700">{errors.gdrive_link}</p>
                        )}
                        <p className="mt-2 text-xs text-muted">
                            File GD harus dibagikan "Siapa saja yang memiliki link". Sistem mengunduh sekali lalu menyimpannya lokal.
                        </p>
                    </form>
                </Card>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                {work.photos.map((photo) => (
                    <Card key={photo.id} className="overflow-hidden">
                        <img
                            src={`/storage/${photo.thumb_path ?? photo.file_path}`}
                            alt=""
                            loading="lazy"
                            className="aspect-square w-full object-cover"
                        />
                        <div className="space-y-2 p-3">
                            <select
                                value={photo.peran}
                                onChange={(e) => ubahPeran(photo, e.target.value)}
                                className="w-full rounded-md border border-line px-2 py-1.5 text-xs text-ink focus:border-ink focus:outline-none"
                            >
                                {Object.entries(PERAN_LABEL).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                            <div className="flex items-center justify-between gap-2">
                                <input
                                    type="number"
                                    min="0"
                                    defaultValue={photo.urutan}
                                    onBlur={(e) => ubahUrutan(photo, e.target.value)}
                                    className="w-16 rounded-md border border-line px-2 py-1 text-xs focus:border-ink focus:outline-none"
                                    title="Urutan tampil"
                                />
                                <button
                                    onClick={() => setTarget(photo)}
                                    className="text-xs text-red-700 underline"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {work.photos.length === 0 && <EmptyState>Belum ada foto di work ini.</EmptyState>}

            <ConfirmModal
                open={target !== null}
                judul="Hapus Foto"
                pesan="Yakin ingin menghapus foto ini? File fisiknya juga dihapus dari server."
                onConfirm={hapus}
                onClose={() => setTarget(null)}
            />
        </AdminLayout>
    );
}