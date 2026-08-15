import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
​
export default function Show({ work, sebelumnya, berikutnya }) {
    return (
        <PublicLayout>
            <Head>
    <title>{`${work.judul} — DzarProject`}</title>
    <meta
        name="description"
        content={work.deskripsi || `Karya ${work.kategori} oleh DzarProject: ${work.judul}.`}
    />
    {work.cover_url && <meta property="og:image" content={work.cover_url} />}
</Head>
​
            {/* 1. Cover pembuka */}
            <section className="relative flex h-[80vh] items-end bg-neutral-900">
                {work.cover_url && (
                    <img
                        src={work.cover_url}
                        alt={work.judul}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative mx-auto w-full max-w-5xl px-6 pb-12 text-white">
                    <p className="text-xs tracking-[0.3em] uppercase">
                        {work.kategori}
                        {work.lokasi ? ` — ${work.lokasi}` : ''}
                    </p>
                    <h1 className="mt-2 font-serif text-5xl md:text-7xl">{work.judul}</h1>
                </div>
            </section>
​
            {/* 2. Intro singkat (opsional) */}
            {work.deskripsi && (
                <section className="mx-auto max-w-3xl px-6 py-16 text-center">
                    <p className="leading-relaxed text-neutral-600">{work.deskripsi}</p>
                </section>
            )}
​
            {/* 3. Zig-zag + selingan full-width tiap foto ke-4 */}
            <section className="mx-auto max-w-6xl space-y-8 px-6 pb-16 md:space-y-16">
                {work.fotos.map((photo, i) => {
                    const penuh = i % 5 === 3;
                    const kiri = i % 2 === 0;
​
                    return (
                        <img
                            key={photo.id}
                            src={photo.url}
                            alt={`${work.judul} — foto ${i + 1}`}
                            loading="lazy"
                            className={
                                penuh
                                    ? 'w-full rounded-sm'
                                    : `rounded-sm md:w-2/3 ${kiri ? 'md:mr-auto' : 'md:ml-auto'}`
                            }
                        />
                    );
                })}
            </section>
​
            {/* 4. Video YouTube (jika ada) */}
            {work.embed_url && (
                <section className="mx-auto max-w-4xl px-6 pb-24">
                    <h2 className="mb-6 text-center font-serif text-3xl">Film</h2>
                    <div className="aspect-video overflow-hidden rounded-sm bg-black">
                        <iframe
                            src={work.embed_url}
                            title={`Film ${work.judul}`}
                            className="h-full w-full"
                            loading="lazy"
                            allowFullScreen
                        />
                    </div>
                </section>
            )}
​
            {/* 5. Navigasi prev/next */}
            <nav className="mx-auto flex max-w-6xl items-center justify-between border-t px-6 py-8 text-sm">
                {sebelumnya ? (
                    <Link href={`/works/${sebelumnya.slug}`} className="hover:underline">
                        ← {sebelumnya.judul}
                    </Link>
                ) : (
                    <span />
                )}
                <Link href="/works" className="text-neutral-500 hover:underline">
                    Semua Karya
                </Link>
                {berikutnya ? (
                    <Link href={`/works/${berikutnya.slug}`} className="hover:underline">
                        {berikutnya.judul} →
                    </Link>
                ) : (
                    <span />
                )}
            </nav>
        </PublicLayout>
    );
}
​