import AikawaStatement from '@/Components/Landing/AikawaStatement';
import EditorialStrip from '@/Components/Landing/EditorialStrip';
import HeroSlideshow from '@/Components/Landing/HeroSlideshow';
import KontakForm from '@/Components/Landing/KontakForm';
import StatementTypography from '@/Components/Landing/StatementTypography';
import Reveal from '@/Components/Reveal';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';

export default function Home({ heroPhotos, tipografiPhotos, stripPhotos, videos }) {
    return (
        <PublicLayout>
            <Head>
                <title>Portofolio Fotografi — DzarProject</title>
                <meta name="description" content="DzarProject — portofolio fotografi wedding, prewedding, lamaran, dan wisuda. Lihat karya terbaik kami." />
                <meta property="og:title" content="DzarProject — Portofolio Fotografi" />
                <meta property="og:description" content="Portofolio fotografi wedding, prewedding, lamaran, dan wisuda." />
            </Head>

            {/* 1. Slideshow hero + logo (ACC) */}
            <HeroSlideshow photos={heroPhotos} />

            {/* 2. Pernyataan tipografi raksasa ala Aikawa (foto urutan 2–3 dari peran Tipografi) */}
            <AikawaStatement photos={tipografiPhotos.slice(1, 3)} />

            {/* 3. Strip editorial horizontal (desktop) / swipe (mobile) */}
            <EditorialStrip photos={stripPhotos} />

            {/* 4. Statement tipografi — foto unggulan (foto urutan 1 dari peran Tipografi) */}
            <StatementTypography photos={tipografiPhotos} />

            {/* 5. Videos */}
            {videos.length > 0 && (
                <section className="mx-auto max-w-5xl px-6 py-24 md:py-32">
                    <Reveal>
                        <h2 className="font-serif text-4xl tracking-[-0.02em]">Videos</h2>
                    </Reveal>
                    <div className="mt-10 grid gap-8 md:grid-cols-2">
                        {videos.map((video) => (
                            <Reveal key={video.id}>
                                <div className="aspect-video overflow-hidden bg-black">
                                    <iframe
                                        src={video.embed_url}
                                        title={video.judul || 'Video'}
                                        className="h-full w-full"
                                        loading="lazy"
                                        allowFullScreen
                                    />
                                </div>
                                {video.judul && (
                                    <p className="mt-3 text-sm text-muted">{video.judul}</p>
                                )}
                            </Reveal>
                        ))}
                    </div>
                </section>
            )}

            {/* 6. Kontak → WhatsApp */}
            <section id="kontak" className="bg-neutral-900 py-24 text-white md:py-32">
                <Reveal className="mx-auto max-w-xl px-6">
                    <h2 className="text-center font-serif text-4xl tracking-[-0.02em]">
                        Mari Bekerja Sama
                    </h2>
                    <p className="mt-4 text-center text-neutral-400">
                        Ceritakan kebutuhan fotomu — pesanmu langsung diteruskan ke WhatsApp kami.
                    </p>
                    <KontakForm />
                </Reveal>
            </section>
        </PublicLayout>
    );
}