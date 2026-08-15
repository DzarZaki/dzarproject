import { Card, Field, PageHeader, PrimaryButton, TextInput } from '@/Components/Admin/ui';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({ nama: '' });

    function submit(e) {
        e.preventDefault();
        post('/admin/categories');
    }

    return (
        <AdminLayout>
            <div className="max-w-md">
                <PageHeader judul="Tambah Kategori" deskripsi="Slug dibuat otomatis dari nama." />

                <Card className="mt-6 p-6">
                    <form onSubmit={submit} className="space-y-4">
                        <Field label="Nama Kategori" error={errors.nama}>
                            <TextInput
                                type="text"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                placeholder="Contoh: Wedding"
                                autoFocus
                            />
                        </Field>

                        <div className="flex items-center gap-3 pt-1">
                            <PrimaryButton type="submit" disabled={processing}>
                                {processing ? 'Menyimpan…' : 'Simpan'}
                            </PrimaryButton>
                            <Link href="/admin/categories" className="text-sm text-muted hover:text-ink">
                                Batal
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </AdminLayout>
    );
}