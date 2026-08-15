import { Card, Field, PageHeader, PrimaryButton, TextInput } from '@/Components/Admin/ui';
import ConfirmModal from '@/Components/ConfirmModal';
import AdminLayout from '@/Layouts/AdminLayout';
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Edit({ about, fotos }) {
    const [target, setTarget] = useState(null);

    const konten = useForm({
        judul: about.judul,
        teks: about.teks ?? '',
        foto: null,
    });

    const galeri = useForm({ foto: [] });

    function simpanKonten(e) {
        e.preventDefault();
        konten.transform((data) => ({ ...data, _method: 'put' })).post('/admin/about', {
            forceFormData: true,
        });
    }

    function submitGaleri(e) {
        e.preventDefault();
        galeri.post('/admin/about/photos', {
            forceFormData: true,
            onSuccess: () => galeri.reset(),
        });
    }

    function ubahUrutan(foto, urutan) {
        router.patch(`/admin/about/photos/${foto.id}`, { urutan: Number(urutan) });
    }

    function hapus() {
        router.delete(`/admin/about/photos/${target.id}`, {
            onFinish: () => setTarget(null),
        });
    }

    return (
        <AdminLayout>
            <PageHeader
                judul="Halaman About"
                deskripsi="Konten halaman /about publik: teks singkat, foto portrait, dan galeri foto."
            />

            <Card className="mt-6 p-6">
                <form onSubmit={simpanKonten} className="space-y-4">
                    <Field label="Judul" error={konten.errors.judul}>
                        <TextInput
                            type="text"
                            value={konten.data.judul}
                            onChange={(e) => konten.setData('judul', e.target.value)}
                        />
                    </Field>

                    <Field label="Teks singkat" error={konten.errors.teks}>
                        <textarea
                            rows="5"
                            value={konten.data.teks}
                            onChange={(e) => konten.setData('teks', e.target.value)}
                            className="w-full rounded-md border border-line px-3 py-2 text-sm transition-colors duration-150 focus:border-ink focus:outline-none"
                            placeholder="Ceritakan tentang DzarProject secara singkat dan jujur…"
                        />
                    </Field>

                    <Field
                        label="Foto portrait (tampil kecil di kanan, seperti pas foto)"
                        error={konten.errors.foto}
                        hint="Kosongkan kalau tidak ingin mengganti foto."
                    >
                        <div className="flex items-center gap-4">
                            {about.foto_path && (
                                <img
                                    src={`/storage/${about.foto_path}`}
                                    alt="Foto portrait saat ini"
                                    className="aspect-[3/4] w-20 rounded-md border border-line object-cover"
                                />
                            )}
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => konten.setData('foto', e.target.files[0])}
                                className="block w-full text-sm text-muted"
                            />
                        </div>
                    </Field>

                    <PrimaryButton type="submit" disabled={konten.processing}>
                        {konten.processing ? 'Menyimpan…' : 'Simpan Konten'}
                    </PrimaryButton>
                </form>
            </Card>

            <div className="mt-10">
                <PageHeader judul="Galeri Foto" deskripsi="Tampil berderet di bawah teks halaman About." />
            </div>

            <Card className="mt-4 p-6">
                <form onSubmit={submitGaleri}>
                    <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => galeri.setData('foto', Array.from(e.target.files))}
                        className="block w-full text-sm text-muted"
                    />
                    {galeri.errors.foto && <p className="mt-1 text-sm text-red-700">{galeri.errors.foto}</p>}
                    <PrimaryButton
                        type="submit"
                        disabled={galeri.processing || galeri.data.foto.length === 0}
                        className="mt-4"
                    >
                        {galeri.processing ? 'Mengunggah…' : 'Unggah Foto'}
                    </PrimaryButton>
                </form>
            </Card>

            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {fotos.map((foto) => (
                    <Card key={foto.id} className="overflow-hidden">
                        <img
                            src={`/storage/${foto.thumb_path ?? foto.file_path}`}
                            alt=""
                            loading="lazy"
                            className="aspect-square w-full object-cover"
                        />
                        <div className="flex items-center justify-between gap-2 p-3">
                            <input
                                type="number"
                                min="0"
                                defaultValue={foto.urutan}
                                onBlur={(e) => ubahUrutan(foto, e.target.value)}
                                className="w-16 rounded-md border border-line px-2 py-1 text-xs focus:border-ink focus:outline-none"
                                title="Urutan tampil"
                            />
                            <button
                                onClick={() => setTarget(foto)}
                                className="text-xs text-red-700 underline"
                            >
                                Hapus
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            <ConfirmModal
                open={target !== null}
                judul="Hapus Foto"
                pesan="Yakin ingin menghapus foto ini dari halaman About? File fisiknya juga dihapus."
                onConfirm={hapus}
                onClose={() => setTarget(null)}
            />
        </AdminLayout>
    );
}