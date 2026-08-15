import { Card, Field, PageHeader, PrimaryButton, TextInput } from '@/Components/Admin/ui';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';

export default function Edit({ category }) {
    const { data, setData, put, processing, errors } = useForm({ nama: category.nama });

    function submit(e) {
        e.preventDefault();
        put(`/admin/categories/${category.id}`);
    }

    return (
        <AdminLayout>
            <div className="max-w-md">
                <PageHeader judul="Ubah Kategori" deskripsi="Slug ikut diperbarui otomatis." />

                <Card className="mt-6 p-6">
                    <form onSubmit={submit} className="space-y-4">
                        <Field label="Nama Kategori" error={errors.nama}>
                            <TextInput
                                type="text"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                autoFocus
                            />
                        </Field>

                        <div className="flex items-center gap-3 pt-1">
                            <PrimaryButton type="submit" disabled={processing}>
                                {processing ? 'Menyimpan…' : 'Simpan Perubahan'}
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