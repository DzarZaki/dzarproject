import { AreaInput, Card, Field, PageHeader, PrimaryButton, SelectInput, TextInput } from '@/Components/Admin/ui';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';

export default function Create({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        judul: '',
        category_id: '',
        deskripsi: '',
        lokasi: '',
        youtube_url: '',
        show_on_landing: false,
        urutan: 0,
    });

    function submit(e) {
        e.preventDefault();
        post('/admin/works');
    }

    return (
        <AdminLayout>
            <div className="max-w-xl">
                <PageHeader judul="Tambah Work" deskripsi="Satu work = satu sesi/album foto." />

                {categories.length === 0 ? (
                    <Card className="mt-6 border-[#FBF3DB] bg-[#FBF3DB]/60 p-4 text-sm text-[#956400]">
                        Belum ada kategori.{' '}
                        <Link href="/admin/categories/create" className="underline">
                            Buat kategori dulu
                        </Link>{' '}
                        sebelum menambah work.
                    </Card>
                ) : (
                    <Card className="mt-6 p-6">
                        <form onSubmit={submit} className="space-y-4">
                            <Field label="Judul Work" error={errors.judul}>
                                <TextInput
                                    type="text"
                                    value={data.judul}
                                    onChange={(e) => setData('judul', e.target.value)}
                                    placeholder="Contoh: A & Z"
                                    autoFocus
                                />
                            </Field>

                            <Field label="Kategori" error={errors.category_id}>
                                <SelectInput
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                >
                                    <option value="">Pilih kategori…</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.nama}
                                        </option>
                                    ))}
                                </SelectInput>
                            </Field>

                            <Field label="Lokasi (opsional)" error={errors.lokasi}>
                                <TextInput
                                    type="text"
                                    value={data.lokasi}
                                    onChange={(e) => setData('lokasi', e.target.value)}
                                    placeholder="Contoh: Bali"
                                />
                            </Field>

                            <Field label="Deskripsi singkat (opsional)" error={errors.deskripsi}>
                                <AreaInput
                                    rows="3"
                                    value={data.deskripsi}
                                    onChange={(e) => setData('deskripsi', e.target.value)}
                                    placeholder="Cerita singkat sesi ini…"
                                />
                            </Field>

                            <Field label="Link YouTube (opsional)" error={errors.youtube_url}>
                                <TextInput
                                    type="url"
                                    value={data.youtube_url}
                                    onChange={(e) => setData('youtube_url', e.target.value)}
                                    placeholder="https://youtube.com/watch?v=…"
                                />
                            </Field>

                            <Field label="Urutan tampil" error={errors.urutan} hint="Angka lebih kecil tampil lebih dulu.">
                                <TextInput
                                    type="number"
                                    min="0"
                                    value={data.urutan}
                                    onChange={(e) => setData('urutan', Number(e.target.value))}
                                    className={undefined}
                                />
                            </Field>

                            <label className="flex items-center gap-2 text-sm text-ink">
                                <input
                                    type="checkbox"
                                    checked={data.show_on_landing}
                                    onChange={(e) => setData('show_on_landing', e.target.checked)}
                                />
                                Tampilkan di landing page
                            </label>

                            <div className="flex items-center gap-3 pt-1">
                                <PrimaryButton type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan…' : 'Simpan'}
                                </PrimaryButton>
                                <Link href="/admin/works" className="text-sm text-muted hover:text-ink">
                                    Batal
                                </Link>
                            </div>
                        </form>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}