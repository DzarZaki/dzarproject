import { useEffect, useRef } from 'react'
import { Head, Link } from '@inertiajs/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PublicLayout from '@/Layouts/PublicLayout'

function alamat(tetangga) {
    if (!tetangga) return null
    return tetangga.link ?? (tetangga.slug ? `/works/${tetangga.slug}` : null)
}

export default function Show({ work, sebelumnya = null, berikutnya = null }) {
    const wadah = useRef(null)

    const zigzag = work?.zigzag ?? []

    useEffect(() => {
        if (zigzag.length === 0) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        gsap.registerPlugin(ScrollTrigger)

        const konteks = gsap.context((diri) => {
            diri.selector('[data-zig]').forEach((el, i) => {
                const kanan = i % 2 === 1

                gsap.fromTo(
                    el,
                    { y: kanan ? 90 : 30 },
                    {
                        y: kanan ? -60 : -20,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 0.5,
                            invalidateOnRefresh: true,
                        },
                    },
                )
            })
        }, wadah)

        return () => konteks.revert()
    }, [zigzag.length])

    if (!work) return null

    const linkSebelumnya = alamat(sebelumnya)
    const linkBerikutnya = alamat(berikutnya)

    return (
        <PublicLayout>
            <Head title={work.judul ?? 'Works'} />

            {work.cover_url ? (
                <div className="h-[62vh] w-full overflow-hidden bg-[#e7e5e0] md:h-[78vh]">
                    <img src={work.cover_url} alt={work.judul ?? ''} className="h-full w-full object-cover" />
                </div>
            ) : null}

            <section className="px-6 py-16 md:px-10 md:py-24">
                <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-16">
                    <div>
                        <h1 className="font-serif text-3xl leading-tight md:text-5xl">{work.judul}</h1>
                        <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1 text-[10px] uppercase tracking-[0.18em] text-muted">
                            {work.lokasi ? <span>{work.lokasi}</span> : null}
                            {work.kategori ? <span>{work.kategori}</span> : null}
                        </div>
                    </div>

                    {work.deskripsi ? (
                        <p className="whitespace-pre-line text-sm leading-relaxed text-[#3f4658] md:text-[15px]">
                            {work.deskripsi}
                        </p>
                    ) : null}
                </div>
            </section>

            {work.embed_url ? (
                <section className="px-6 pb-16 md:px-10 md:pb-24">
                    <div className="mx-auto aspect-video w-full max-w-5xl overflow-hidden bg-black">
                        <iframe
                            src={work.embed_url}
                            title={work.judul ?? 'Video'}
                            allow="encrypted-media; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                            className="h-full w-full"
                        />
                    </div>
                </section>
            ) : null}

            {zigzag.length > 0 ? (
                <section ref={wadah} className="overflow-hidden px-6 pb-20 md:px-10 md:pb-32">
                    <div className="mx-auto flex max-w-6xl flex-col gap-16 md:gap-28">
                        {zigzag.map((foto, i) => (
                            <div
                                key={foto.id ?? i}
                                data-zig
                                className={`w-full will-change-transform md:w-[58%] ${
                                    i % 2 === 1 ? 'md:self-end' : 'md:self-start'
                                }`}
                            >
                                <div className="overflow-hidden bg-[#e7e5e0]">
                                    <img
                                        src={foto.url ?? foto.thumb}
                                        alt=""
                                        loading="lazy"
                                        className="h-auto w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-[1.03]"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ) : null}

            {linkSebelumnya || linkBerikutnya ? (
                <nav className="flex items-center justify-between gap-6 border-t border-line px-6 py-10 text-[10px] uppercase tracking-[0.18em] md:px-10">
                    {linkSebelumnya ? (
                        <Link href={linkSebelumnya} className="text-muted transition-colors duration-150 hover:text-ink">
                            {sebelumnya.judul ?? 'Sebelumnya'}
                        </Link>
                    ) : (
                        <span />
                    )}

                    <Link href="/works" className="text-muted transition-colors duration-150 hover:text-ink">
                        Semua karya
                    </Link>

                    {linkBerikutnya ? (
                        <Link href={linkBerikutnya} className="text-muted transition-colors duration-150 hover:text-ink">
                            {berikutnya.judul ?? 'Berikutnya'}
                        </Link>
                    ) : (
                        <span />
                    )}
                </nav>
            ) : null}
        </PublicLayout>
    )
}