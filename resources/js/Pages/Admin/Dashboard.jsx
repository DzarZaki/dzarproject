import { Head, Link } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { Badge, Card, PageHeader } from '@/Components/Admin/ui'

const ANGKA = [
    { kunci: 'slideshow', label: 'Slide show' },
    { kunci: 'horizontal', label: 'Foto horizontal' },
    { kunci: 'work', label: 'Work' },
    { kunci: 'kategori', label: 'Kategori' },
    { kunci: 'video', label: 'Video' },
]

export default function Dashboard({ statistik, langkah }) {
    const belum = langkah.filter((l) => !l.selesai).length

    return (
        <AdminLayout>
            <Head title="Dashboard" />

            <PageHeader
                judul="Dashboard"
                catatan={
                    belum === 0
                        ? 'Semua tahap pengisian konten sudah beres.'
                        : `Masih ada ${belum} tahap yang perlu diisi. Ikuti urutan di bawah.`
                }
            />

            <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {ANGKA.map((a) => (
                    <Card key={a.kunci} className="p-5">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{a.label}</p>
                        <p className="mt-2 font-serif text-3xl text-ink">{statistik[a.kunci]}</p>
                    </Card>
                ))}
            </div>

            <h2 className="mb-4 text-[11px] uppercase tracking-[0.14em] text-muted">Alur pengisian konten</h2>

            <ol className="space-y-3">
                {langkah.map((l) => (
                    <li key={l.nomor}>
                        <Link
                            href={l.link}
                            className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-line bg-white px-5 py-4 transition-colors duration-150 hover:border-ink/30"
                        >
                            <span
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] ${
                                    l.selesai ? 'bg-ink text-white' : 'border border-line text-muted'
                                }`}
                            >
                                {l.nomor}
                            </span>

                            <span className="min-w-0 flex-1">
                                <span className="block text-sm text-ink">{l.judul}</span>
                                <span className="mt-0.5 block text-xs text-muted">{l.catatan}</span>
                            </span>

                            {l.nomor === 5 ? (
                                <Badge ok={l.selesai}>{l.selesai ? 'Lengkap' : `${l.jumlah} belum ada cover`}</Badge>
                            ) : (
                                <Badge ok={l.selesai}>{l.selesai ? `${l.jumlah} terisi` : 'Belum ada isi'}</Badge>
                            )}
                        </Link>
                    </li>
                ))}
            </ol>

            <Card className="mt-10">
                <h3 className="mb-3 text-[11px] uppercase tracking-[0.14em] text-muted">Yang perlu diingat</h3>
                <ul className="space-y-2 text-sm text-muted">
                    <li>Slide show hanya butuh foto dan urutan tampil. Tidak punya halaman detail.</li>
                    <li>Foto horizontal muncul hanya di strip landing page, ukurannya bisa kecil, sedang, atau besar.</li>
                    <li>Work muncul di halaman Works dengan potongan persegi.</li>
                    <li>Foto horizontal dan work sama sama punya halaman detail. Isi lewat aksi "Foto" di tabel.</li>
                    <li>Foto zigzag di halaman detail boleh sebanyak apa pun, tanpa batas jumlah.</li>
                </ul>
            </Card>
        </AdminLayout>
    )
}