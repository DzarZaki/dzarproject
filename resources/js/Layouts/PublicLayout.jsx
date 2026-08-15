import { Link } from '@inertiajs/react';

export default function PublicLayout({ children }) {
    return (
        <div className="bg-bone font-sans text-ink">
            <header className="fixed inset-x-0 top-0 z-40">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    {/* Kiri: logo + nama */}
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/images/logo.png" alt="Logo DzarProject" className="h-9 w-auto" />
                        <span className="font-serif text-lg tracking-[0.35em] uppercase mix-blend-difference text-white">
                            DzarProject
                        </span>
                    </Link>

                    {/* Kanan: menu */}
                    <div className="flex gap-6 text-xs tracking-[0.2em] uppercase mix-blend-difference text-white md:gap-8">
                        <Link href="/">Home</Link>
                        <Link href="/works">Works</Link>
                        <Link href="/about">About</Link>
                        <a href="/#kontak">Contact</a>
                    </div>
                </nav>
            </header>

            {children}

            <footer className="border-t border-line py-10 text-center text-sm text-muted">
                <p>© {new Date().getFullYear()} DzarProject — Wedding, Prewedding, Lamaran & Wisuda.</p>
            </footer>
        </div>
    );
}