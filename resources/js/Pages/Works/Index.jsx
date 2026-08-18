import { useEffect, useRef, useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import PublicLayout from '@/Layouts/PublicLayout'

const LEBAR_SARINGAN = 'min-w-[176px]'

function ChevronKecil() {
    return (
        <svg
            viewBox="0 0 10 6"
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-1/2 h-[6px] w-[10px] -translate-y-1/2 text-muted"
        >
            <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
    )
}

/* daftar pilihan dibuat sendiri, bukan select bawaan peramban, supaya tulisan
   di dalam daftarnya bisa ditata rata tengah dan hurufnya seragam dengan situs */
function Saringan({ nilai, saatUbah, kosong, daftar }) {
    const wadah = useRef(null)
    const [buka, setBuka] = useState(false)

    const pilihan = [{ nilai: '', label: kosong }, ...daftar]
    const terpilih = pilihan.find((p) => p.nilai === (nilai ?? '')) ?? pilihan[0]

    useEffect(() => {
        if (!buka) return

        const saatKlikLuar = (e) => {
            if (!wadah.current?.contains(e.target)) setBuka(false)
        }

        const saatTombol = (e) => {
            if (e.key === 'Escape') setBuka(false)
        }

        document.addEventListener('pointerdown', saatKlikLuar)
        document.addEventListener('keydown', saatTombol)

        return () => {
            document.removeEventListener('pointerdown', saatKlikLuar)
            document.removeEventListener('keydown', saatTombol)
        }
    }, [buka])

    return (
        <div ref={wadah} className={`relative ${LEBAR_SARINGAN}`}>
            <button
                type="button"
                onClick={() => setBuka((b) => !b)}
                aria-haspopup="listbox"
                aria-expanded={buka}
                className="relative flex w-full items-center justify-center py-1 pr-6 text-center text-[11px] uppercase tracking-[0.16em] text-ink transition-opacity duration-150 hover:opacity-60"
            >
                {terpilih.label}
                <ChevronKecil />
            </button>

            {buka ? (
                <ul
                    role="listbox"
                    className="absolute left-0 top-full z-30 mt-2 w-full border border-line bg-bone py-1 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
                >
                    {pilihan.map((p) => (
                        <li key={p.nilai || 'semua'}>
                            <button
                                type="button"
                                role="option"
                                aria-selected={p.nilai === (nilai ?? '')}
                                onClick={() => {
                                    setBuka(false)
                                    if (p.nilai !== (nilai ?? '')) saatUbah(p.nilai)
                                }}
                                className={`block w-full px-4 py-2 text-center text-[11px] uppercase tracking-[0.16em] transition-colors duration-150 hover:bg-white ${
                                    p.nilai === (nilai ?? '') ? 'italic text-ink' : 'text-muted'
                                }`}
                            >
                                {p.label}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    )
}

export default function Index({
    works = [],
    categories = [],
    locations = [],
    kategoriAktif = '',
    lokasiAktif = '',
}) {
    const [sorot, setSorot] = useState(null)

    /* kedua saringan dikirim bersama supaya pilihan yang satu tidak menghapus yang lain */
    const pilih = (ubahan) => {
        const isi = {
            kategori: kategoriAktif ?? '',
            lokasi: lokasiAktif ?? '',
            ...ubahan,
        }

        const kirim = {}
        if (isi.kategori) kirim.kategori = isi.kategori
        if (isi.lokasi) kirim.lokasi = isi.lokasi

        router.get('/works', kirim, { preserveScroll: true, preserveState: false })
    }

    return (
        <PublicLayout>
            <Head title="Works" />

            <section className="px-6 pb-24 pt-14 md:px-10 md:pb-32 md:pt-16">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                    <Saringan
                        nilai={kategoriAktif}
                        saatUbah={(v) => pilih({ kategori: v })}
                        kosong="All Categories"
                        daftar={categories.map((k) => ({ nilai: k.slug, label: k.nama }))}
                    />

                    <Saringan
                        nilai={lokasiAktif}
                        saatUbah={(v) => pilih({ lokasi: v })}
                        kosong="All Locations"
                        daftar={locations.map((l) => ({ nilai: l, label: l }))}
                    />
                </div>

                {works.length === 0 ? (
                    <p className="py-24 text-sm text-muted">Belum ada karya untuk pilihan ini.</p>
                ) : (
                    <div
                        className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-3 xl:grid-cols-7"
                        onMouseLeave={() => setSorot(null)}
                    >
                        {works.map((w, i) => {
                            const aktif = sorot === i
                            const redup = sorot !== null && !aktif

                            return (
                                <Link
                                    key={w.id ?? w.slug ?? i}
                                    href={w.link ?? `/works/${w.slug}`}
                                    onMouseEnter={() => setSorot(i)}
                                    onFocus={() => setSorot(i)}
                                    className="block"
                                >
                                    <div className="relative aspect-square overflow-hidden bg-[#e7e5e0]">
                                        <img
                                            src={w.thumb ?? w.url}
                                            alt={w.judul ?? ''}
                                            loading={i < 14 ? 'eager' : 'lazy'}
                                            decoding="async"
                                            className={`h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                                                aktif ? 'scale-[1.05]' : 'scale-100'
                                            }`}
                                            style={{ transform: 'translateZ(0)' }}
                                        />
                                        <span
                                            className={`pointer-events-none absolute inset-0 bg-white transition-opacity duration-300 ${
                                                redup ? 'opacity-40' : 'opacity-0'
                                            }`}
                                        />
                                    </div>

                                    {/* baris keterangan: nama rata kiri, kategori rata kanan,
                                        lokasi menumpuk di bawah nama. kategori dan lokasi hanya
                                        muncul saat kursor menyentuh fotonya, dan lokasi dipasang
                                        melayang supaya tinggi barisnya tidak ikut berubah */}
                                    <div className="relative mt-2">
                                        <div className="flex items-baseline justify-between gap-2 text-[9px] uppercase tracking-[0.18em]">
                                            <span
                                                className={`truncate transition-colors duration-200 ${
                                                    redup ? 'text-muted' : 'text-ink'
                                                }`}
                                            >
                                                {w.judul}
                                            </span>

                                            {w.kategori ? (
                                                <span
                                                    className={`shrink-0 text-muted transition-opacity duration-200 ${
                                                        aktif ? 'opacity-100' : 'opacity-0'
                                                    }`}
                                                >
                                                    {w.kategori}
                                                </span>
                                            ) : null}
                                        </div>

                                        {w.lokasi ? (
                                            <span
                                                className={`pointer-events-none absolute left-0 top-full mt-1 block max-w-full truncate text-[9px] uppercase tracking-[0.18em] text-muted transition-opacity duration-200 ${
                                                    aktif ? 'opacity-100' : 'opacity-0'
                                                }`}
                                            >
                                                {w.lokasi}
                                            </span>
                                        ) : null}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </section>
        </PublicLayout>
    )
}