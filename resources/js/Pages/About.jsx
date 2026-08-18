import { Head } from '@inertiajs/react'
import PublicLayout from '@/Layouts/PublicLayout'

export default function About({ about = {} }) {
    const label = about.label || 'About Us'
    const judul = about.judul || 'Authentic Archive'

    return (
        <PublicLayout>
            <Head title="About" />

            <section className="px-6 py-24 md:px-10 md:py-36">
                <p className="text-[10px] uppercase tracking-[0.28em] text-muted">{label}</p>

                <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-[minmax(0,0.85fr)_140px_minmax(0,1.7fr)] md:items-start md:gap-14">
                    <h1 className="font-serif text-3xl leading-tight md:text-4xl">{judul}</h1>

                    <div className="w-[140px]">
                        <div className="aspect-[4/5] overflow-hidden bg-[#e7e5e0]">
                            {about.portrait_url ? (
                                <img
                                    src={about.portrait_url}
                                    alt=""
                                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-[1.05]"
                                />
                            ) : null}
                        </div>
                    </div>

                    <div className="space-y-6 text-sm leading-relaxed text-[#3f4658] md:text-[15px]">
                        {about.paragraf_1 ? <p className="whitespace-pre-line">{about.paragraf_1}</p> : null}
                        {about.paragraf_2 ? <p className="whitespace-pre-line">{about.paragraf_2}</p> : null}
                    </div>
                </div>
            </section>

            {about.full_url ? (
                <section className="h-[52vh] w-full overflow-hidden md:h-[58vh]">
                    <img src={about.full_url} alt="" className="h-full w-full object-cover grayscale" />
                </section>
            ) : null}
        </PublicLayout>
    )
}