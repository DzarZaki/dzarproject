import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/* Batas tinggi bagian ini, dihitung dari tinggi layar. Ubah ke 1 kalau mau setinggi layar penuh. */
const BATAS_TINGGI = 0.88
const BATAS_TINGGI_KECIL = 0.7

/* Perbandingan sisi cadangan, dipakai sebelum ukuran asli foto terbaca. */
const RASIO_CADANGAN = 9 / 21

function hematGerak() {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function PitaMono({ foto = null, alt = '' }) {
    const bingkai = useRef(null)
    const gambar = useRef(null)
    const rasio = useRef(RASIO_CADANGAN)

    const [tinggi, setTinggi] = useState(0)

    /* Tinggi mengikuti bentuk asli foto, tapi tidak boleh melebihi batas tinggi layar,
       supaya foto lanskap tidak terpotong keras di atas dan bawah. */
    const hitung = useCallback(() => {
        const el = bingkai.current
        if (!el) return

        const lebar = el.clientWidth || window.innerWidth
        const batas = window.innerWidth >= 768 ? BATAS_TINGGI : BATAS_TINGGI_KECIL

        setTinggi(Math.round(Math.min(window.innerHeight * batas, lebar * rasio.current)))
    }, [])

    useEffect(() => {
        if (!foto) return

        hitung()
        window.addEventListener('resize', hitung)
        return () => window.removeEventListener('resize', hitung)
    }, [foto, hitung])

    const saatMuat = (e) => {
        const { naturalWidth, naturalHeight } = e.currentTarget

        if (naturalWidth > 0 && naturalHeight > 0) {
            rasio.current = naturalHeight / naturalWidth
            hitung()
        }

        ScrollTrigger.refresh()
    }

    /* Foto masuk dengan skala sedikit lebih besar lalu mengendur ke ukuran pas. */
    useEffect(() => {
        if (!foto || !bingkai.current || !gambar.current || tinggi === 0 || hematGerak()) return

        gsap.registerPlugin(ScrollTrigger)

        const anim = gsap.fromTo(
            gambar.current,
            { scale: 1.06 },
            {
                scale: 1,
                ease: 'none',
                force3D: true,
                scrollTrigger: {
                    trigger: bingkai.current,
                    start: 'top bottom',
                    end: 'bottom center',
                    scrub: 0.8,
                    invalidateOnRefresh: true,
                },
            },
        )

        return () => {
            anim.scrollTrigger?.kill()
            anim.kill()
        }
    }, [foto, tinggi])

    if (!foto) return null

    return (
        <section
            ref={bingkai}
            className="relative w-full overflow-hidden bg-ink"
            style={{ height: tinggi > 0 ? tinggi : undefined, minHeight: tinggi > 0 ? undefined : '60vh' }}
        >
            <img
                ref={gambar}
                src={foto}
                alt={alt}
                decoding="async"
                onLoad={saatMuat}
                className="absolute inset-0 h-full w-full object-cover grayscale"
                style={{ transform: 'translateZ(0)' }}
            />
        </section>
    )
}