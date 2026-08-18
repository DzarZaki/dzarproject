import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from '@inertiajs/react'
import { gsap } from 'gsap'

const JUDUL_LATAR = 'PORTOFOLIO'
const HURUF = JUDUL_LATAR.split('')
const TAUTAN_SEMUA = '/works'
const AWALAN_KATEGORI = '/works?kategori='

/* gelombang huruf */
const RADIUS_GELOMBANG = 220
const ANGKAT = 26
const DORONG = 6
const PUTAR = 3.5

/* coverflow */
const SAMPING_TAMPIL = 2
const SUDUT_SAMPING = 26
const DORONG_SAMPING = 0.34
const KEDALAMAN = 0.24
const MASK_CERMIN = 'linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.08) 60%, transparent 92%)'

function hematGerak() {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/* jarak melingkar terpendek dari kartu ke kartu aktif */
function selisihPutar(i, aktif, jumlah) {
    let o = i - aktif
    const setengah = jumlah / 2

    if (o > setengah) o -= jumlah
    if (o < -setengah) o += jumlah

    return o
}

function PanahIkon({ arah }) {
    const kiri = arah === 'kiri'

    return (
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
            <path d={kiri ? 'M15 5H1' : 'M1 5h14'} stroke="currentColor" strokeWidth="1" />
            <path
                d={kiri ? 'M5 1 1 5l4 4' : 'M11 1l4 4-4 4'}
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
            />
        </svg>
    )
}

export default function CategoryCarousel({ kategori = [] }) {
    const jumlah = kategori.length

    const [aktif, setAktif] = useState(0)
    const [besar, setBesar] = useState(true)
    const [ukuran, setUkuran] = useState({ lebar: 900, tinggi: 506, tindih: 120 })

    const panggung = useRef(null)
    const chip = useRef(null)
    const wadahJudul = useRef(null)
    const kartuRef = useRef([])
    const tiraiRef = useRef([])
    const hurufRef = useRef([])
    const posisiHuruf = useRef([])
    const gerakHuruf = useRef([])
    const pertama = useRef(true)
    const geser = useRef({ turun: false, x: 0, jarak: 0 })

    const item = kategori[aktif] ?? null

    /* satu tween per huruf, dibuat sekali */
    useEffect(() => {
        gerakHuruf.current = hurufRef.current.map((el) =>
            el
                ? {
                      y: gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3.out' }),
                      x: gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3.out' }),
                      r: gsap.quickTo(el, 'rotation', { duration: 0.7, ease: 'power3.out' }),
                  }
                : null,
        )
    }, [])

    const ukurHuruf = useCallback(() => {
        const wadah = wadahJudul.current
        if (!wadah) return

        const kotak = wadah.getBoundingClientRect()

        posisiHuruf.current = hurufRef.current.map((el) => {
            if (!el) return null

            const k = el.getBoundingClientRect()

            return { x: k.left - kotak.left + k.width / 2, y: k.top - kotak.top + k.height / 2 }
        })
    }, [])

    /* kartu ikut lebar layar, tapi tetap dijaga agar tidak lebih tinggi dari setengah layar */
    useEffect(() => {
        const hitung = () => {
            const lebarLayar = window.innerWidth
            const tinggiLayar = window.innerHeight

            let lebar = Math.max(280, Math.min(lebarLayar * 0.62, 1000))
            let tinggi = (lebar * 9) / 16

            const tinggiMaks = tinggiLayar * 0.5

            if (tinggi > tinggiMaks) {
                tinggi = tinggiMaks
                lebar = (tinggi * 16) / 9
            }

            const ukuranJudul = Math.max(64, Math.min(lebarLayar * 0.18, 320))

            setBesar(lebarLayar >= 768)
            setUkuran({
                lebar: Math.round(lebar),
                tinggi: Math.round(tinggi),
                tindih: Math.round(ukuranJudul * 0.42),
            })

            window.requestAnimationFrame(ukurHuruf)
        }

        hitung()
        window.addEventListener('resize', hitung)
        return () => window.removeEventListener('resize', hitung)
    }, [ukurHuruf])

    useEffect(() => {
        if (!chip.current) return
        gsap.set(chip.current, { xPercent: -50, yPercent: -100, opacity: 0, scale: 0.92 })
    }, [])

    /* susun kartu mengelilingi kartu aktif */
    useEffect(() => {
        if (jumlah === 0) return

        const { lebar } = ukuran
        const langsung = pertama.current || hematGerak()
        const lama = langsung ? 0 : 0.85

        kategori.forEach((_, i) => {
            const el = kartuRef.current[i]
            if (!el) return

            const o = selisihPutar(i, aktif, jumlah)
            const j = Math.abs(o)
            const tampil = j <= SAMPING_TAMPIL

            gsap.set(el, { zIndex: 30 - j, pointerEvents: tampil ? 'auto' : 'none' })
            gsap.to(el, {
                x: o * lebar * DORONG_SAMPING,
                z: -j * lebar * KEDALAMAN,
                rotationY: o * SUDUT_SAMPING,
                scale: 1 - Math.min(j, 3) * 0.12,
                opacity: tampil ? 1 : 0,
                duration: lama,
                ease: 'power3.out',
                force3D: true,
                overwrite: 'auto',
            })

            const tirai = tiraiRef.current[i]
            if (!tirai) return

            gsap.to(tirai, {
                opacity: Math.min(j, 3) * 0.24,
                duration: lama,
                ease: 'power3.out',
                overwrite: 'auto',
            })
        })

        pertama.current = false
    }, [aktif, jumlah, kategori, ukuran])

    const pindah = useCallback(
        (arah) => {
            if (jumlah < 2) return
            setAktif((n) => (n + arah + jumlah) % jumlah)
        },
        [jumlah],
    )

    const gelombang = useCallback(
        (e) => {
            const wadah = wadahJudul.current
            if (!wadah || !besar || hematGerak()) return

            const kotak = wadah.getBoundingClientRect()
            const mx = e.clientX - kotak.left
            const my = e.clientY - kotak.top

            posisiHuruf.current.forEach((p, i) => {
                const g = gerakHuruf.current[i]
                if (!p || !g) return

                const dx = mx - p.x
                const dy = my - p.y
                const jarak = Math.sqrt(dx * dx + dy * dy)
                const t = Math.max(0, 1 - jarak / RADIUS_GELOMBANG)
                const kuat = t * t * (3 - 2 * t)
                const arah = dx === 0 ? 0 : dx > 0 ? -1 : 1

                g.y(-ANGKAT * kuat)
                g.x(arah * DORONG * kuat)
                g.r(arah * PUTAR * kuat)
            })
        },
        [besar],
    )

    const redakan = useCallback(() => {
        gerakHuruf.current.forEach((g) => {
            if (!g) return
            g.y(0)
            g.x(0)
            g.r(0)
        })
    }, [])

    const gerakChip = (e) => {
        const el = panggung.current
        const c = chip.current
        if (!el || !c) return

        const kotak = el.getBoundingClientRect()

        gsap.to(c, {
            x: e.clientX - kotak.left,
            y: e.clientY - kotak.top - 18,
            duration: 0.35,
            ease: 'power3.out',
            overwrite: 'auto',
        })
    }

    const tampilChip = () => {
        if (!chip.current) return
        gsap.to(chip.current, { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out', overwrite: 'auto' })
    }

    const sembunyiChip = () => {
        geser.current.turun = false
        if (!chip.current) return
        gsap.to(chip.current, { opacity: 0, scale: 0.92, duration: 0.2, ease: 'power2.out', overwrite: 'auto' })
    }

    const turun = (e) => {
        geser.current = { turun: true, x: e.clientX, jarak: 0 }
    }

    const naik = (e) => {
        if (!geser.current.turun) return

        const selisih = e.clientX - geser.current.x
        geser.current.turun = false
        geser.current.jarak = Math.abs(selisih)

        if (Math.abs(selisih) > 60) pindah(selisih < 0 ? 1 : -1)
    }

    const klikKartu = (e, i, o) => {
        if (geser.current.jarak > 8) {
            e.preventDefault()
            return
        }

        if (o !== 0) {
            e.preventDefault()
            setAktif(i)
        }
    }

    if (jumlah === 0 || !item) return null

    const { lebar, tinggi, tindih } = ukuran
    const jarakPandang = `${Math.round(lebar * 2.2)}px`
    const tinggiCermin = Math.round(tinggi * 0.34)

    return (
        <section
            onPointerMove={gelombang}
            onPointerLeave={redakan}
            className="relative overflow-hidden bg-bone pb-32 pt-14 md:pb-40 md:pt-20"
        >
            <div ref={wadahJudul} className="relative z-0 select-none text-center">
                <h2
                    className="whitespace-nowrap font-serif leading-[0.9] tracking-[-0.02em] text-ink"
                    style={{ fontSize: 'clamp(64px, 18vw, 320px)' }}
                >
                    <span className="sr-only">{JUDUL_LATAR}</span>

                    {HURUF.map((h, i) => (
                        <span
                            key={i}
                            aria-hidden="true"
                            ref={(el) => {
                                hurufRef.current[i] = el
                            }}
                            className="inline-block will-change-transform"
                        >
                            {h}
                        </span>
                    ))}
                </h2>
            </div>

            <div className="relative z-10" style={{ marginTop: -tindih }}>
                <div ref={panggung} className="relative mx-auto" style={{ width: lebar }}>
                    <div
                        onPointerDown={turun}
                        onPointerUp={naik}
                        style={{ height: tinggi, perspective: jarakPandang }}
                    >
                        <div className="relative h-full w-full" style={{ transformStyle: 'preserve-3d' }}>
                            {kategori.map((k, i) => {
                                const o = selisihPutar(i, aktif, jumlah)
                                const gambar = k.thumb_url
                                const tautan = k.link ?? AWALAN_KATEGORI + k.slug

                                return (
                                    <div
                                        key={k.id ?? i}
                                        ref={(el) => {
                                            kartuRef.current[i] = el
                                        }}
                                        className="absolute left-0 top-0 h-full w-full"
                                        style={{ transformStyle: 'preserve-3d' }}
                                    >
                                        <Link
                                            href={tautan}
                                            draggable={false}
                                            aria-label={k.nama}
                                            onClick={(e) => klikKartu(e, i, o)}
                                            onPointerEnter={() => {
                                                if (o === 0) tampilChip()
                                            }}
                                            onPointerLeave={sembunyiChip}
                                            onPointerMove={(e) => {
                                                if (o === 0) gerakChip(e)
                                            }}
                                            className="group relative block h-full w-full overflow-hidden bg-[#e7e5e0]"
                                        >
                                            {gambar ? (
                                                <img
                                                    src={gambar}
                                                    alt={k.nama}
                                                    draggable={false}
                                                    decoding="async"
                                                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04]"
                                                    style={{ transform: 'translateZ(0)' }}
                                                />
                                            ) : null}

                                            <span className="pointer-events-none absolute inset-0 grid place-items-center px-8">
                                                <span
                                                    className="font-serif text-white/85"
                                                    style={{
                                                        fontSize: 'clamp(28px, 4.6vw, 84px)',
                                                        lineHeight: 1,
                                                        textShadow: '0 2px 26px rgba(0,0,0,0.45)',
                                                    }}
                                                >
                                                    {k.nama}
                                                </span>
                                            </span>

                                            <span
                                                ref={(el) => {
                                                    tiraiRef.current[i] = el
                                                }}
                                                className="pointer-events-none absolute inset-0 bg-bone"
                                                style={{ opacity: 0 }}
                                            />
                                        </Link>

                                        <div
                                            className="pointer-events-none absolute left-0 w-full overflow-hidden"
                                            style={{
                                                top: '100%',
                                                height: tinggiCermin,
                                                maskImage: MASK_CERMIN,
                                                WebkitMaskImage: MASK_CERMIN,
                                            }}
                                        >
                                            {gambar ? (
                                                <img
                                                    src={gambar}
                                                    alt=""
                                                    aria-hidden="true"
                                                    className="w-full object-cover"
                                                    style={{
                                                        height: tinggi,
                                                        transform: 'scaleY(-1)',
                                                        opacity: 0.5,
                                                        filter: 'blur(1px)',
                                                    }}
                                                />
                                            ) : null}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <span
                        ref={chip}
                        className="pointer-events-none absolute left-0 top-0 z-40 rounded-full bg-black/60 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-white backdrop-blur"
                    >
                        View
                    </span>
                </div>

                <div className="relative z-20 flex justify-center" style={{ marginTop: Math.round(tinggi * 0.14) }}>
                    <div className="flex items-center gap-2 rounded-full bg-black/50 p-2 text-white backdrop-blur">
                        <span className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-white/20">
                            {item.thumb_url ? (
                                <img src={item.thumb_url} alt="" className="h-full w-full object-cover" />
                            ) : null}
                        </span>

                        <span className="px-2 text-[10px] uppercase tracking-[0.22em]">{item.nama}</span>

                        <button
                            type="button"
                            onClick={() => pindah(-1)}
                            aria-label="Kategori sebelumnya"
                            disabled={jumlah < 2}
                            className="grid h-8 w-8 place-items-center rounded-full transition-colors duration-150 hover:bg-white/15 disabled:opacity-40"
                        >
                            <PanahIkon arah="kiri" />
                        </button>

                        <button
                            type="button"
                            onClick={() => pindah(1)}
                            aria-label="Kategori berikutnya"
                            disabled={jumlah < 2}
                            className="grid h-8 w-8 place-items-center rounded-full transition-colors duration-150 hover:bg-white/15 disabled:opacity-40"
                        >
                            <PanahIkon arah="kanan" />
                        </button>

                        <Link
                            href={TAUTAN_SEMUA}
                            aria-label="Lihat semua karya"
                            className="ml-1 grid h-9 w-9 place-items-center rounded-full border border-white/40 transition-colors duration-150 hover:bg-white/15"
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                                <rect x="1" y="1" width="5" height="5" stroke="currentColor" strokeWidth="1" />
                                <rect x="8" y="1" width="5" height="5" stroke="currentColor" strokeWidth="1" />
                                <rect x="1" y="8" width="5" height="5" stroke="currentColor" strokeWidth="1" />
                                <rect x="8" y="8" width="5" height="5" stroke="currentColor" strokeWidth="1" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}