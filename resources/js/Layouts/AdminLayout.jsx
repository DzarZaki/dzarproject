import { Link, router, usePage } from '@inertiajs/react';

export default function AdminLayout({ children }) {
    const { url } = usePage();

    const menu = [
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/categories', label: 'Kategori' },
        { href: '/admin/works', label: 'Works' },
        { href: '/admin/videos', label: 'Videos' },
        { href: '/admin/about', label: 'About' },
    ];

    const aktif = (href) => (href === '/admin' ? url === '/admin' : url.startsWith(href));

    return (
        <div className="min-h-screen bg-bone font-sans text-ink">
            <header className="border-b border-line bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-8">
                        <Link href="/admin" className="flex items-center gap-2.5">
                            <img src="/images/logo.png" alt="" className="h-7 w-auto" />
                            <span className="font-serif text-base tracking-[0.25em] uppercase">
                                DzarProject
                            </span>
                            <span className="text-xs text-muted">Admin</span>
                        </Link>
                        <nav className="flex gap-1 text-sm">
                            {menu.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`rounded-md px-3 py-1.5 transition-colors duration-150 ${
                                        aktif(item.href)
                                            ? 'bg-bone font-medium text-ink'
                                            : 'text-muted hover:text-ink'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <a href="/" className="text-muted transition-colors duration-150 hover:text-ink">
                            Lihat Situs →
                        </a>
                        <button
                            onClick={() => router.post('/logout')}
                            className="text-red-700 transition-colors duration-150 hover:text-red-900"
                        >
                            Keluar
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
        </div>
    );
}