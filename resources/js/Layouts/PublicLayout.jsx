import { useEffect, useRef, useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

const IG_URL = 'https://www.instagram.com/dzargrad/'
const TIKTOK_UTAMA = 'https://www.tiktok.com/@dzarlathuf'
const TIKTOK_KEDUA = 'https://www.tiktok.com/@berkeringat.co'

/* satu daftar untuk semua tautan media sosial.
   karena akun TikTok ada dua, namanya dibedakan dengan nama akunnya,
   bukan dengan angka. menambah akun lain nanti cukup menambah satu baris */
const SOSIAL = [
    { label: 'Instagram', href: IG_URL },
    { label: 'TikTok @dzarlathuf', href: TIKTOK_UTAMA },
    { label: 'TikTok @berkeringat.co', href: TIKTOK_KEDUA },
]

const MENU = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Works', href: '/works' },
    { label: 'Contact', href: '/contact' },
]

/* aturan gaya yang dibutuhkan gulir halus.
   berkas gaya resmi Lenis juga mematikan pointer-events pada iframe,
   baris itu sengaja tidak dipakai supaya pemutar video tetap bisa diklik */
const GAYA_HALUS = `
html.lenis, html.lenis body { height: auto; }
.lenis.lenis-smooth { scroll-behavior: auto !important; }
.lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
.lenis.lenis-stopped { overflow: hidden; }
`

export default function PublicLayout({ children }) {
    const { url } = usePage()
    const beranda = url === '/' || url.startsWith('/?')

    // terang = header sedang menumpang di atas foto layar penuh
    const [terang, setTerang] = useState(beranda)
    const penanda = useRef(null)

    /* gulir halus: posisi gulir asli tetap dipakai, hanya diinterpolasi tiap
       bingkai, lalu ScrollTrigger disuruh ikut jam yang sama */
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        gsap.registerPlugin(ScrollTrigger)

        const halus = new Lenis({
            lerp: 0.085,
            wheelMultiplier: 1,
            touchMultiplier: 1.6,
            smoothWheel: true,
        })

        halus.on('scroll', ScrollTrigger.update)

        const kutu = (waktu) => halus.raf(waktu * 1000)
        gsap.ticker.add(kutu)
        gsap.ticker.lagSmoothing(0)

        ScrollTrigger.refresh()

        return () => {
            gsap.ticker.remove(kutu)
            gsap.ticker.lagSmoothing(500, 33)
            halus.destroy()
        }
    }, [])

    useEffect(() => {
        if (!beranda) {
            setTerang(false)
            return
        }

        const el = penanda.current
        if (!el) return

        const pengamat = new IntersectionObserver(([entri]) => setTerang(entri.isIntersecting), {
            rootMargin: '-72px 0px 0px 0px',
        })

        pengamat.observe(el)
        return () => pengamat.disconnect()
    }, [beranda])

    const aktif = (href) => (href === '/' ? beranda : url.startsWith(href))

    return (
        <div className="min-h-screen bg-bone text-ink">
            <style>{GAYA_HALUS}</style>

            <header
                className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
                    terang ? 'text-white' : 'border-b border-line bg-bone/90 text-ink backdrop-blur'
                }`}
            >
                {terang ? (
                    <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-black/55 via-black/25 to-transparent" />
                ) : null}

                <div className="flex items-center justify-between px-6 py-4 md:px-10">
                    <Link href="/" className="flex items-center gap-3">
                        <img
                            src="/images/logo.png"
                            alt=""
                            className={`h-8 w-8 rounded-sm object-contain transition-shadow duration-300 ${
                                terang ? 'bg-white/95 p-[3px] shadow-[0_2px_14px_rgba(0,0,0,0.35)]' : ''
                            }`}
                        />
                        <span className={`text-sm uppercase tracking-[0.26em] ${terang ? 'bayang-teks' : ''}`}>
                            dzarproject
                        </span>
                    </Link>

                    <nav className="flex items-center gap-5 md:gap-8">
                        {MENU.map((m) => (
                            <Link
                                key={m.href}
                                href={m.href}
                                className={`text-[11px] uppercase tracking-[0.18em] transition-opacity duration-150 hover:opacity-60 ${
                                    aktif(m.href) ? 'italic' : ''
                                } ${terang ? 'bayang-teks' : ''}`}
                            >
                                {m.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>

            <div className="relative">
                {beranda ? (
                    <div ref={penanda} className="pointer-events-none absolute left-0 top-[92vh] h-px w-full" />
                ) : null}
                <main className={beranda ? '' : 'pt-[72px]'}>{children}</main>
            </div>

            <footer className="border-t border-line bg-bone px-6 py-10 md:px-10">
                <div className="flex flex-col gap-4 text-[11px] uppercase tracking-[0.18em] text-muted md:flex-row md:items-center md:justify-between">
                    <p>{'All content Copyright "2026 DzarProject"'}</p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        {SOSIAL.map((s) => (
                            <a
                                key={s.href}
                                href={s.href}
                                target="_blank"
                                rel="noreferrer"
                                className="transition-opacity duration-150 hover:opacity-60"
                            >
                                {s.label}
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    )
}