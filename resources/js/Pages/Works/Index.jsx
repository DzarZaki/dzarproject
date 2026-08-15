import DropdownFilter from '@/Components/DropdownFilter';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ works, categories, kategoriAktif }) {
    return (
        <PublicLayout>
            <Head>
                <title>Works — DzarProject</title>
                <meta name="description" content="Jelajahi semua karya fotografi DzarProject: wedding, prewedding, lamaran, wisuda." />
            </Head>

            <section className="mx-auto max-w-6xl px-6 pt-32 pb-24 md:pt-40">
                <h1 className="font-serif text-5xl tracking-[-0.02em]">Works</h1>

                {/* Filter dropdown ala ILUMINEN */}
                <div className="mt-8">
                    <DropdownFilter
                        label="Kategori"
                        semuaLabel="Semua Kategori"
                        options={categories.map((c) => ({ value: c.slug, label: c.nama }))}
                        nilaiAktif={kategoriAktif}
                        onPilih={(slug) => router.get(slug ? `/works?kategori=${slug}` : '/works')}
                    />
                </div>

                <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3">
                    {works.map((work) => (
                        <Link key={work.slug} href={`/works/${work.slug}`} className="group">
                            <div className="overflow-hidden rounded-sm border border-line bg-white">
                                {work.cover ? (
                                    <img
                                        src={work.cover}
                                        alt={work.judul}
                                        loading="lazy"
                                        className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                                    />
                                ) : (
                                    <div className="aspect-[3/4] w-full" />
                                )}
                            </div>
                            <div className="mt-3 flex items-baseline justify-between">
                                <p className="font-medium">{work.judul}</p>
                                <p className="text-xs tracking-widest text-muted uppercase">
                                    {work.kategori}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                {works.length === 0 && (
                    <p className="mt-16 text-center text-muted">
                        Belum ada karya pada kategori ini.
                    </p>
                )}
            </section>
        </PublicLayout>
    );
}