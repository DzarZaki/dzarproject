import { Link, router, usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'

const MENU = [
    { label: 'Dashboard', href: '/admin', cocok: (p) => p === '/admin' },
    { label: 'Works', href: '/admin/works', cocok: (p) => p.startsWith('/admin/works') },
    { label: 'Kategori', href: '/admin/categories', cocok: (p) => p.startsWith('/admin/categories') },
    { label: 'Video', href: '/admin/videos', cocok: (p) => p.startsWith('/admin/videos') },
    { label: 'About', href: '/admin/about', cocok: (p) => p.startsWith('/admin/about') },
]

function Flash() {
    const { flash } = usePage().props
    const pesan = flash?.sukses ?? flash?.galat ?? null
    const galat = Boolean(flash?.galat)
    const [tampil, setTampil] = useState(Boolean(pesan))

    useEffect(() => {
        if (!pesan) {
            setTampil(false)
            return
        }

        setTampil(true)
        const waktu = setTimeout(() => setTampil(false), 4000)

        return () => clearTimeout(waktu)
    }, [pesan])

    if (!pesan || !tampil) return null

    return (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
            <div
                className={`rounded-lg px-4 py-2.5 text-sm shadow-sm ${
                    galat ? 'bg-[#fdebec] text-[#9f2f2d]' : 'bg-ink text-white'
                }`}
            >
                {pesan}
            </div>
        </div>
    )
}

export default function AdminLayout({ children }) {
    const { auth } = usePage().props
    const path = typeof window === 'undefined' ? '' : window.location.pathname

    const keluar = () => router.post('/logout')

    return (
        <div className="min-h-screen bg-bone text-ink">
            <header className="sticky top-0 z-40 border-b border-line bg-bone/90 backdrop-blur">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-6 py-4">
                    <Link href="/admin" className="text-[13px] uppercase tracking-[0.24em]">
                        dzarproject
                    </Link>

                    <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.14em]">
                        {MENU.map((m) => (
                            <Link
                                key={m.href}
                                href={m.href}
                                className={`transition-colors duration-150 ${
                                    m.cocok(path) ? 'text-ink' : 'text-muted hover:text-ink'
                                }`}
                            >
                                {m.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="ml-auto flex items-center gap-4 text-[11px] uppercase tracking-[0.14em] text-muted">
                        <a href="/" target="_blank" rel="noreferrer" className="hover:text-ink">
                            Lihat situs
                        </a>
                        <span className="hidden sm:inline">{auth?.user?.name}</span>
                        <button type="button" onClick={keluar} className="text-muted transition-colors hover:text-ink">
                            Keluar
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>

            <Flash />
        </div>
    )
}