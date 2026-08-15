import Reveal from '@/Components/Reveal';
import { Link } from '@inertiajs/react';

/**
 * Tipografi raksasa sebagai konten — ala aikawakenichi.com.
 * Foto tampil INLINE di tengah kalimat (memakai foto berperan
 * "Landing — Tipografi" urutan ke-2 dan ke-3 dari admin).
 */
export default function AikawaStatement({ photos = [] }) {
    const [fotoA, fotoB] = photos;

    return (
        <section className="border-y border-line bg-bone px-6 py-32 md:py-44">
            <Reveal className="mx-auto max-w-6xl">
                <p className="text-center font-serif text-[9vw] leading-[1.05] tracking-[-0.02em] text-ink md:text-[5.2vw]">
                    Mengabadikan
                    {fotoA && <InlineFoto foto={fotoA} />}
                    momen yang <em className="text-gold italic">tak terlupakan</em>,
                    {fotoB && <InlineFoto foto={fotoB} />}
                    dengan cara yang jujur.
                </p>
            </Reveal>
        </section>
    );
}

function InlineFoto({ foto }) {
    return (
        <Link href={`/works/${foto.work_slug}`} className="group">
            <img
                src={foto.url}
                alt={foto.work_judul}
                loading="lazy"
                className="mx-[0.12em] inline-block h-[0.85em] w-[1.9em] rounded-full object-cover align-baseline transition-transform duration-500 group-hover:scale-110"
                style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
            />
        </Link>
    );
}