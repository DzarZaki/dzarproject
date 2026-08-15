import { useEffect, useState } from 'react';

export default function HeroSlideshow({ photos = [] }) {
    const [aktif, setAktif] = useState(0);

    useEffect(() => {
        if (photos.length < 2) return;
        const timer = setInterval(() => setAktif((i) => (i + 1) % photos.length), 5000);
        return () => clearInterval(timer);
    }, [photos.length]);

    if (photos.length === 0) {
        return (
            <section className="flex h-screen items-center justify-center bg-neutral-900 text-white">
                <div className="flex items-center gap-5">
                    <img src="/images/logo.png" alt="Logo DzarProject" className="h-16 w-auto" />
                    <h1 className="font-serif text-5xl">DzarProject</h1>
                </div>
            </section>
        );
    }

    const geser = (arah) => setAktif((i) => (i + arah + photos.length) % photos.length);

    return (
        <section className="relative h-screen overflow-hidden bg-neutral-900">
            {photos.map((photo, i) => (
                <img
                    key={photo.id}
                    src={photo.url}
                    alt={photo.work_judul}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                        i === aktif ? 'opacity-100' : 'opacity-0'
                    }`}
                />
            ))}

            <div className="absolute inset-0 bg-black/30" />

            {/* Logo + nama (bagian yang sudah di-ACC) */}
            <div className="absolute bottom-10 left-6 text-white md:left-10">
                <div className="flex items-end gap-4">
                    <img
                        src="/images/logo.png"
                        alt="Logo DzarProject"
                        className="mb-1 h-14 w-auto md:h-20"
                    />
                    <h1 className="font-serif text-5xl leading-none md:text-6xl">DzarProject</h1>
                </div>
                <p className="mt-3 text-sm tracking-[0.4em]">
                    {String(aktif + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
                </p>
                <p className="mt-1 text-sm text-neutral-200">{photos[aktif].work_judul}</p>
            </div>

            {photos.length > 1 && (
                <div className="absolute right-6 bottom-10 flex gap-3 md:right-10">
                    <button
                        onClick={() => geser(-1)}
                        aria-label="Foto sebelumnya"
                        className="rounded-full border border-white/60 px-4 py-2 text-white transition hover:bg-white hover:text-black"
                    >
                        ←
                    </button>
                    <button
                        onClick={() => geser(1)}
                        aria-label="Foto berikutnya"
                        className="rounded-full border border-white/60 px-4 py-2 text-white transition hover:bg-white hover:text-black"
                    >
                        →
                    </button>
                </div>
            )}
        </section>
    );
}