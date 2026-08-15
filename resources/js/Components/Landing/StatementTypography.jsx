import { Link } from '@inertiajs/react';

export default function StatementTypography({ photos = [] }) {
    const foto = photos[0];
    if (!foto) return null;

    return (
        <section className="relative overflow-hidden bg-bone py-28 md:py-36">
            <h2 className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-serif text-[22vw] leading-none tracking-[-0.04em] text-ink/5 select-none">
                DZAR
            </h2>

            <div className="relative mx-auto max-w-3xl px-6">
                <Link href={`/works/${foto.work_slug}`} className="group block">
                    <img
                        src={foto.url}
                        alt={foto.work_judul}
                        loading="lazy"
                        className="w-full rounded-sm border border-line object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                    />
                    <p className="mt-4 text-center text-xs tracking-[0.3em] text-muted uppercase">
                        {foto.work_judul} — Lihat Karya
                    </p>
                </Link>
            </div>
        </section>
    );
}