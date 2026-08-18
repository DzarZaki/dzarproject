import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const NAMA = 'DZARPROJECT'
const SUBNAMA = 'Time Journey'
const JEDA_OTOMATIS = 6500

function ChevronKiri() {
    return (
        <svg width="9" height="10" viewBox="0 0 9 10" fill="none" aria-hidden="true">
            <path d="M6 1 1.6 5 6 9" stroke="currentColor" strokeWidth="1" />
        </svg>
    )
}

function ChevronKanan() {
    return (
        <svg width="9" height="10" viewBox="0 0 9 10" fill="none" aria-hidden="true">
            <path d="M3 1 7.4 5 3 9" stroke="currentColor" strokeWidth="1" />
        </svg>
    )
}

function Panah({ arah, onClick, label }) {
    const kiri = arah === 'kiri'

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className="group flex items-center gap-2 py-2 text-white/85 transition-colors duration-150 hover:text-white"
        >
            {kiri ? <ChevronKiri /> : null}
            <span className="block h-px w-10 bg-current transition-[width] duration-200 group-hover:w-14 md:w-14 md:group-hover:w-20" />
            {kiri ? null : <ChevronKanan />}
        </button>
    )
}

export default function HeroSlideshow({ slides = [] }) {
    const [indeks, setIndeks] = useState(0)
    const lapisan = useRef([])
    const judul = useRef(null)
    const tahan = useRef(false)

    const jumlah = slides.length

    const ke = useCallback(
        (arah) => {
            if (jumlah < 2) return
            setIndeks((i) => (i + arah + jumlah) % jumlah)
        },
        [jumlah],
    )

    useEffect(() => {
        const kurangGerak = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        lapisan.current.forEach((el, i) => {
            if (!el) return
            const ini = i === indeks

            gsap.to(el, {
                opacity: ini ? 1 : 0,
                duration: kurangGerak ? 0 : 1.1,
                ease: 'power2.out',
                overwrite: 'auto',
            })

            const gambar = el.querySelector('img')
            if (gambar && ini && !kurangGerak) {
                gsap.fromTo(gambar, { scale: 1 }, { scale: 1.06, duration: 9, ease: 'none', overwrite: 'auto' })
            }
        })
    }, [indeks])

    useEffect(() => {
        if (indeks !== 0 || !judul.current) return
        const kurangGerak = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (kurangGerak) return

        gsap.fromTo(
            judul.current.children,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, overwrite: 'auto' },
        )
    }, [indeks])

    useEffect(() => {
        if (jumlah < 2) return

        const pengatur = window.setInterval(() => {
            if (!tahan.current) setIndeks((i) => (i + 1) % jumlah)
        }, JEDA_OTOMATIS)

        return () => window.clearInterval(pengatur)
    }, [jumlah])

    useEffect(() => {
        const tombol = (e) => {
            if (e.key === 'ArrowRight') ke(1)
            if (e.key === 'ArrowLeft') ke(-1)
        }

        window.addEventListener('keydown', tombol)
        return () => window.removeEventListener('keydown', tombol)
    }, [ke])

    if (jumlah === 0) {
        return (
            <section className="flex h-[100svh] items-end justify-center bg-[#e7e5e0] pb-24">
                <div className="flex flex-col items-center text-ink">
                    <span className="font-serif text-3xl tracking-[0.28em] md:text-5xl">{NAMA}</span>
                    <span className="mt-3 text-[10px] uppercase tracking-[0.36em] text-muted">{SUBNAMA}</span>
                </div>
            </section>
        )
    }

    const nomor = String(indeks + 1).padStart(2, '0')
    const total = String(jumlah).padStart(2, '0')

    return (
        <section
            className="relative h-[100svh] w-full overflow-hidden bg-black"
            onMouseEnter={() => {
                tahan.current = true
            }}
            onMouseLeave={() => {
                tahan.current = false
            }}
        >
            {slides.map((s, i) => (
                <div
                    key={s.id ?? i}
                    ref={(el) => {
                        lapisan.current[i] = el
                    }}
                    className="absolute inset-0"
                    style={{ opacity: i === 0 ? 1 : 0 }}
                >
                    <img
                        src={s.url ?? s.thumb}
                        alt=""
                        loading={i === 0 ? 'eager' : 'lazy'}
                        className="h-full w-full object-cover will-change-transform"
                    />
                </div>
            ))}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/45 to-transparent" />

            {indeks === 0 ? (
                <div
                    ref={judul}
                    className="pointer-events-none absolute inset-x-0 bottom-28 flex flex-col items-center text-white md:bottom-32"
                >
                    <span className="font-serif text-3xl tracking-[0.28em] md:text-5xl">{NAMA}</span>
                    <span className="mt-3 text-[10px] uppercase tracking-[0.36em] text-white/80">{SUBNAMA}</span>
                </div>
            ) : null}

            <div className="absolute inset-x-0 bottom-8 flex items-center justify-between px-6 md:px-10">
                <Panah arah="kiri" label="Slide sebelumnya" onClick={() => ke(-1)} />

                <div className="flex flex-col items-end text-white/85">
                    <span className="text-[10px] tracking-[0.22em]">{nomor}</span>
                    <Panah arah="kanan" label="Slide berikutnya" onClick={() => ke(1)} />
                    <span className="text-[10px] tracking-[0.22em] text-white/55">{total}</span>
                </div>
            </div>
        </section>
    )
}