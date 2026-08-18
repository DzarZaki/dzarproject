import { useState } from 'react'
import { Head } from '@inertiajs/react'
import PublicLayout from '@/Layouts/PublicLayout'

const WA_BASE = 'https://wa.me/'
const IG_URL = 'https://www.instagram.com/dzargrad/'
const TIKTOK_UTAMA = 'https://www.tiktok.com/@dzarlathuf'
const TIKTOK_KEDUA = 'https://www.tiktok.com/@berkeringat.co'

/* GANTI baris ini dengan alamat surel usaha kamu. */
const EMAIL_BISNIS = 'dzarproject@gmail.com'

/* karena akun TikTok ada dua, tiap baris memakai nama akunnya sebagai pembeda.
   menambah akun lain nanti cukup menambah satu baris di daftar ini */
const SOSIAL = [
    { label: 'Instagram @dzargrad', href: IG_URL },
    { label: 'TikTok @dzarlathuf', href: TIKTOK_UTAMA },
    { label: 'TikTok @berkeringat.co', href: TIKTOK_KEDUA },
]

const inputKelas =
    'w-full border-b border-line bg-transparent py-3 text-sm text-ink outline-none transition-colors duration-150 placeholder:text-muted/70 focus:border-ink/50'

const labelKelas = 'text-[10px] uppercase tracking-[0.18em] text-muted'

/* Rapikan nomor menjadi angka saja, lalu tampilkan berkelompok agar mudah dibaca. */
function rapikanNomor(angka) {
    if (!angka) return ''

    return angka.replace(/(\d{2})(\d{3})(\d{4})(\d.*)?/, (cocok, a, b, c, d) =>
        [a, b, c, d].filter(Boolean).join(' '),
    )
}

function Baris({ judul, children }) {
    return (
        <div>
            <p className={labelKelas}>{judul}</p>
            <div className="mt-2 flex flex-col gap-1 text-sm text-ink">{children}</div>
        </div>
    )
}

export default function Contact({ waNumber = '' }) {
    const [nama, setNama] = useState('')
    const [kontak, setKontak] = useState('')
    const [pesan, setPesan] = useState('')
    const [galat, setGalat] = useState('')

    const nomor = String(waNumber).replace(/[^0-9]/g, '')

    const kirim = (e) => {
        e.preventDefault()

        if (!nama.trim() || !pesan.trim()) {
            setGalat('Nama dan pesan wajib diisi.')
            return
        }

        if (!nomor) {
            setGalat('Nomor WhatsApp belum diatur. Hubungi lewat Instagram untuk sementara.')
            return
        }

        setGalat('')

        const baris = [
            `Halo dzarproject, saya ${nama.trim()}.`,
            kontak.trim() ? `Kontak saya: ${kontak.trim()}` : null,
            '',
            pesan.trim(),
        ].filter((b) => b !== null)

        const tujuan = WA_BASE + nomor + '?text=' + encodeURIComponent(baris.join('\n'))
        window.open(tujuan, '_blank', 'noopener')
    }

    return (
        <PublicLayout>
            <Head title="Contact" />

            <section className="px-6 py-24 md:px-10 md:py-32">
                <h1 className="font-serif text-4xl leading-tight md:text-6xl">Contact Us</h1>

                <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[#3f4658] md:text-[15px]">
                    Isi formulir di sebelah kanan dan ceritakan rencana acaramu, mulai dari tanggal, lokasi, sampai
                    hal yang paling ingin kamu abadikan. Setelah formulir terkirim, percakapan berlanjut di WhatsApp
                    bersama tim dzarproject untuk membahas ketersediaan tanggal dan pilihan paketnya.
                </p>

                <div className="mt-16 grid gap-14 md:mt-20 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] md:gap-20">
                    <div className="flex flex-col gap-9">
                        <Baris judul="Email">
                            <a
                                href={`mailto:${EMAIL_BISNIS}`}
                                className="transition-opacity duration-150 hover:opacity-60"
                            >
                                {EMAIL_BISNIS}
                            </a>
                        </Baris>

                        {nomor ? (
                            <Baris judul="WhatsApp">
                                <a
                                    href={WA_BASE + nomor}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="transition-opacity duration-150 hover:opacity-60"
                                >
                                    {`+${rapikanNomor(nomor)}`}
                                </a>
                            </Baris>
                        ) : null}

                        <Baris judul="Social Media">
                            {SOSIAL.map((s) => (
                                <a
                                    key={s.href}
                                    href={s.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="transition-opacity duration-150 hover:opacity-60"
                                >
                                    {s.label}
                                </a>
                            ))}
                        </Baris>
                    </div>

                    <form onSubmit={kirim} className="max-w-xl">
                        <label className="block">
                            <span className={labelKelas}>Nama</span>
                            <input
                                type="text"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                className={inputKelas}
                                placeholder="Nama kamu"
                            />
                        </label>

                        <label className="mt-8 block">
                            <span className={labelKelas}>Email atau WhatsApp</span>
                            <input
                                type="text"
                                value={kontak}
                                onChange={(e) => setKontak(e.target.value)}
                                className={inputKelas}
                                placeholder="Supaya kami bisa menghubungimu kembali"
                            />
                        </label>

                        <label className="mt-8 block">
                            <span className={labelKelas}>Pesan</span>
                            <textarea
                                rows={5}
                                value={pesan}
                                onChange={(e) => setPesan(e.target.value)}
                                className={`${inputKelas} resize-none`}
                                placeholder="Tanggal dan lokasi acara, jumlah orang, serta hal lain yang perlu kami tahu"
                            />
                        </label>

                        {galat ? <p className="mt-4 text-xs text-[#b23b3b]">{galat}</p> : null}

                        <button
                            type="submit"
                            className="mt-10 border border-ink px-7 py-3 text-[10px] uppercase tracking-[0.28em] text-ink transition-colors duration-150 hover:bg-ink hover:text-white"
                        >
                            Kirim lewat WhatsApp
                        </button>
                    </form>
                </div>
            </section>
        </PublicLayout>
    )
}