import Reveal from '@/Components/Reveal';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';

export default function About({ about, fotos }) {
    return (
        <PublicLayout>
            <Head>
                <title>About — DzarProject</title>
                <meta name="description" content={about.teks?.slice(0, 150) || 'Tentang DzarProject.'} />
            </Head>

            {/* Teks singkat + foto pas di kanan */}
            <section className="mx-auto max-w-5xl px-6 pt-40 pb-24 md:pt-48">
                <Reveal>
                    <p className="text-xs tracking-[0.3em] text-muted uppercase">About</p>
                </Reveal>

                <div className="mt-8 flex flex-col-reverse items-start gap-10 md:flex-row md:items-end md:justify-between">
                    <Reveal className="max-w-2xl">
                        <h1 className="font-serif text-5xl leading-[1.08] tracking-[-0.02em] md:text-6xl">
                            {about.judul}
                        </h1>
                        <p className="mt-6 leading-[1.6] whitespace-pre-line text-muted">
                            {about.teks}
                        </p>
                    </Reveal>

                    {about.foto_url && (
                        <Reveal className="shrink-0">
                            <img
                                src={about.foto_url}
                                alt="Foto DzarProject"
                                className="aspect-[3/4] w-40 rounded-sm border border-line object-cover md:w-52"
                            />
                        </Reveal>
                    )}
                </div>
            </section>

            {/* Galeri foto di bawahnya */}
            {fotos.length > 0 && (
                <section className="mx-auto max-w-6xl px-6 pb-32">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        {fotos.map((foto) => (
                            <Reveal key={foto.id}>
                                <img
                                    src={foto.url}
                                    alt=""
                                    loading="lazy"
                                    className="aspect-[4/5] w-full rounded-sm border border-line object-cover"
                                />
                            </Reveal>
                        ))}
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}