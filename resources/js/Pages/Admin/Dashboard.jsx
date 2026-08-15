import { Card, PageHeader } from '@/Components/Admin/ui';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';

export default function Dashboard({ auth, statistik }) {
    const kartu = [
        { href: '/admin/categories', label: 'Kategori', jumlah: statistik.categories },
        { href: '/admin/works', label: 'Works', jumlah: statistik.works },
        { href: '/admin/videos', label: 'Videos', jumlah: statistik.videos },
    ];

    return (
        <AdminLayout>
            <PageHeader judul="Dashboard" deskripsi={`Selamat datang, ${auth.user.name}.`} />

            <div className="mt-8 grid gap-4 md:grid-cols-3">
                {kartu.map((k) => (
                    <Link key={k.href} href={k.href}>
                        <Card className="p-6 transition-colors duration-150 hover:bg-bone">
                            <p className="font-serif text-4xl tracking-[-0.02em] text-ink">{k.jumlah}</p>
                            <p className="mt-1 text-sm text-muted">{k.label} →</p>
                        </Card>
                    </Link>
                ))}
            </div>
        </AdminLayout>
    );
}