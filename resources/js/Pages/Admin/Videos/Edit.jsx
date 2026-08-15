import { Card, Field, PageHeader, PrimaryButton, TextInput } from '@/Components/Admin/ui';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';

function embedUrl(url) {
    const m = url?.match(
        /(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return m ? `{{https://www.youtube.com/embed/${m[1]}` : null;
}

export default function Edit({ video }) {
    const { data, setData, put, processing, errors } = useForm({
        judul: video.judul ?? '',
        youtube_url: video.youtube_url,
        urutan: video.urutan,
    });

    const preview = embedUrl(data.youtube_url);

    function submit(e) {
        e.preventDefault();
        put(`/admin/videos/${video.id}`);
    }

    return (
        <AdminLayout>
            <div className="max-w-xl">
                <PageHeader judul="Ubah Video" deskripsi={video.judul || video.youtube_url} />

                <Card className="mt-6 p-6">
                    <form onSubmit={submit} className="space-y-4">
                        <Field label="Judul (opsional)" error={errors.judul}>
                            <TextInput
                                type="text"
                                value={data.judul}
                                onChange={(e) => setData('judul', e.target.value)}
                                autoFocus
                            />
                        </Field>

                        <Field label="Link YouTube" error={errors.youtube_url}>
                            <TextInput
                                type="url"
                                value={data.youtube_url}
                                onChange={(e) => setData('youtube_url', e.target.value)}
                            />
                        </Field>

                        <Field label="Urutan tampil" error={errors.urutan}>
                            <TextInput
                                type="number"
                                min="0"
                                value={data.urutan}
                                onChange={(e) => setData('urutan', Number(e.target.value))}
                            />
                        </Field>

                        {preview && (
                            <div>
                                <p className="mb-1 text-sm text-muted">Pratinjau:</p>
                                <iframe
                                    src={preview}
                                    title="Pratinjau video"
                                    className="aspect-video w-full rounded-md border border-line"
                                    allowFullScreen
                                />
                            </div>
                        )}

                        <div className="flex items-center gap-3 pt-1">
                            <PrimaryButton type="submit" disabled={processing}>
                                {processing ? 'Menyimpan…' : 'Simpan Perubahan'}
                            </PrimaryButton>
                            <Link href="/admin/videos" className="text-sm text-muted hover:text-ink">
                                Batal
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </AdminLayout>
    );
}