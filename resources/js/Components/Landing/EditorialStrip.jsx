import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function EditorialStrip({ photos = [] }) {
    const wrapRef = useRef(null);
    const trackRef = useRef(null);
    const [progres, setProgres] = useState(0);
    const [geser, setGeser] = useState(0);

    // Ukur seberapa jauh track harus bergeser (lebar track - lebar layar)
    useEffect(() => {
        function ukur() {
            if (trackRef.current) {
                setGeser(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
            }
        }
        ukur();
        window.addEventListener('resize', ukur);
        return () => window.removeEventListener('resize', ukur);
    }, [photos]);

    // Scroll vertikal -> gerakan horizontal
    useEffect(() => {
        function onScroll() {
            const el = wrapRef.current;
            if (!el) return;
            const total = el.offsetHeight - window.innerHeight;
            const p = total > 0 ? Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total)) : 0;
            setProgres(p);
        }
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (photos.length === 0) return null;

    const kelasFoto = (i) =>
        [
            'h-[60vh] w-[40vw]',
            'h-[75vh] w-[30vw]',
            'h-[50vh] w-[35vw]',
        ][i % 3];

    return (
        <>
            {/* Desktop: strip horizontal digerakkan scroll */}
            <section ref={wrapRef} className="relative hidden bg-white md:block" style={{ height: '320vh' }}>
                <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                    <div
                        ref={trackRef}
                        className="flex items-center gap-10 px-[10vw] will-change-transform"
                        style={{ transform: `translateX(-${progres * geser}px)` }}
                    >
                        {photos.map((photo, i) => (
                            <Link key={photo.id} href={`/works/${photo.work_slug}`} className="group shrink-0">
                                <img
                                    src={photo.url}
                                    alt={photo.work_judul}
                                    loading="lazy"
                                    className={`rounded-sm object-cover transition duration-500 group-hover:opacity-90 ${kelasFoto(i)}`}
                                />
                                <p className="mt-3 text-xs tracking-[0.25em] text-neutral-500 uppercase">
                                    {photo.work_judul}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mobile: swipe horizontal native */}
            <section className="overflow-x-auto bg-white py-10 md:hidden">
                <div className="flex snap-x snap-mandatory gap-4 px-4">
                    {photos.map((photo) => (
                        <Link
                            key={photo.id}
                            href={`/works/${photo.work_slug}`}
                            className="w-4/5 shrink-0 snap-center"
                        >
                            <img
                                src={photo.url}
                                alt={photo.work_judul}
                                loading="lazy"
                                className="aspect-[3/4] w-full rounded-sm object-cover"
                            />
                            <p className="mt-2 text-xs tracking-[0.25em] text-neutral-500 uppercase">
                                {photo.work_judul}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>
        </>
    );
}