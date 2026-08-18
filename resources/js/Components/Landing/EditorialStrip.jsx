import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from '@inertiajs/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const TINGGI = {
    kecil: '34vh',
    sedang: '48vh',
    besar: '62vh',
}

const RATA = ['flex-start', 'center', 'flex-end']
const SISA_KANAN = 80

/* bilangan semu-acak yang selalu sama untuk id yang sama,
   supaya tata letak tidak berubah setiap render dan aman untuk SSR */
function acak(n) {
    const x = Math.sin(n * 12.9898) * 43758.5453
    return x - Math.floor(x)
}

export default function EditorialStrip({ items = [] }) {
    const bagian = useRef(null)
    const jalur = useRef(null)
    const [hemat, setHemat] = useState(false)

    /* posisi vertikal tiap foto: atas, tengah, atau bawah, dengan jarak aman
       dari kedua tepi dan tanpa pola berulang */
    const tata = useMemo(() => {
        const hasil = []

        items.forEach((item, i) => {
            const biji = (Number(item.id) || i + 1) * 7.13 + i * 3.77
            let kode = Math.floor(acak(biji) * 3) % 3

            if (i >= 1 && hasil[i - 1].kode === kode && acak(biji * 1.77) > 0.45) {
                kode = (kode + 1) % 3
            }

            if (i >= 2 && hasil[i - 1].kode === kode && hasil[i - 2].kode === kode) {
                kode = (kode + 2) % 3
            }

            const geser = 2 + Math.round(acak(biji * 1.31) * 6)
            const naik = acak(biji * 2.09) > 0.5
            const gaya = { alignSelf: RATA[kode] }

            if (kode === 0) gaya.marginTop = `${(geser * 0.5).toFixed(1)}vh`
            if (kode === 1) gaya.marginTop = `${(naik ? -geser * 0.6 : geser * 0.6).toFixed(1)}vh`
            if (kode === 2) gaya.marginBottom = `${(geser * 0.5).toFixed(1)}vh`

            hasil.push({ kode, gaya })
        })

        return hasil
    }, [items])

    useEffect(() => {
        setHemat(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    }, [])

    useEffect(() => {
        if (items.length === 0) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        gsap.registerPlugin(ScrollTrigger)

        const konteks = gsap.context(() => {
            const jarak = () => Math.max(0, (jalur.current?.scrollWidth ?? 0) - window.innerWidth + SISA_KANAN)

            /* satu lapis komposit untuk seluruh jalur, digeser lewat translate 3D
               supaya kartu grafis yang menggambar, bukan tata letak halaman */
            gsap.set(jalur.current, { force3D: true, willChange: 'transform' })

            gsap.to(jalur.current, {
                x: () => -jarak(),
                ease: 'none',
                force3D: true,
                scrollTrigger: {
                    trigger: bagian.current,
                    start: 'top top',
                    end: () => `+=${Math.max(1, jarak())}`,
                    pin: true,
                    pinSpacing: true,
                    anticipatePin: 1,
                    scrub: 0.9,
                    invalidateOnRefresh: true,
                    fastScrollEnd: true,
                },
            })
        }, bagian)

        /* lebar jalur baru diketahui setelah semua foto selesai dimuat,
           jadi panjang gulir dihitung ulang di situ */
        const daftar = Array.from(jalur.current?.querySelectorAll('img') ?? [])
        const belum = daftar.filter((g) => !g.complete)
        let sisa = belum.length

        const selesai = () => {
            sisa -= 1
            if (sisa <= 0) ScrollTrigger.refresh()
        }

        belum.forEach((g) => {
            g.addEventListener('load', selesai)
            g.addEventListener('error', selesai)
        })

        if (belum.length === 0) ScrollTrigger.refresh()

        const penjaga = window.setTimeout(() => ScrollTrigger.refresh(), 1200)

        return () => {
            window.clearTimeout(penjaga)
            belum.forEach((g) => {
                g.removeEventListener('load', selesai)
                g.removeEventListener('error', selesai)
            })
            konteks.revert()
        }
    }, [items.length])

    if (items.length === 0) return null

    const kelasBagian = hemat
        ? 'relative flex min-h-[70svh] items-center overflow-x-auto bg-bone no-scrollbar py-16'
        : 'relative flex h-[100svh] items-center overflow-hidden bg-bone'

    return (
        <section ref={bagian} className={kelasBagian}>
            <div ref={jalur} className="flex h-[80vh] items-start gap-8 px-6 md:gap-14 md:px-10">
                {items.map((item, i) => (
                    <Link
                        key={item.id ?? i}
                        href={item.link}
                        draggable={false}
                        style={tata[i]?.gaya}
                        className="group flex shrink-0 flex-col items-start"
                    >
                        <div
                            className="overflow-hidden bg-[#e7e5e0]"
                            style={{ height: TINGGI[item.ukuran] ?? TINGGI.sedang }}
                        >
                            <img
                                src={item.thumb ?? item.url}
                                alt={item.judul ?? ''}
                                draggable={false}
                                decoding="async"
                                className="h-full w-auto max-w-none object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04]"
                                style={{ transform: 'translateZ(0)' }}
                            />
                        </div>

                        <div className="mt-3 flex w-full items-baseline justify-between gap-6 text-[10px] uppercase tracking-[0.18em]">
                            <span className="min-w-0 truncate text-ink">{item.judul}</span>
                            <span className="shrink-0 text-muted">{item.lokasi}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}