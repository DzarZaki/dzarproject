import { Head, Link, router } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { Badge, EmptyState, LinkButton, PageHeader, Pil, PrimaryButton, TableCard, THead, Thumb } from '@/Components/Admin/ui'

const JENIS = ['slideshow', 'horizontal', 'work']

const CATATAN = {
    slideshow: 'Foto full screen paling atas landing page. Cukup foto dan urutan tampil.',
    horizontal: 'Strip foto potret yang bergeser saat halaman digulir. Punya halaman detail.',
    work: 'Kartu persegi di halaman Works. Punya halaman detail.',
}

export default function WorksIndex({ jenis, labelJenis, works }) {
    const slideshow = jenis === 'slideshow'
    const horizontal = jenis === 'horizontal'

    const kolom = slideshow
        ? ['Foto', 'Urutan', 'Aksi']
        : horizontal
          ? ['Foto', 'Judul', 'Lokasi', 'Kategori', 'Ukuran', 'Urutan', 'Detail', 'Aksi']
          : ['Foto', 'Judul', 'Lokasi', 'Kategori', 'Urutan', 'Detail', 'Aksi']

    const hapus = (baris) => {
        const nama = baris.judul ?? 'baris ini'
        if (!window.confirm(`Hapus ${nama} beserta seluruh fotonya?`)) return

        router.delete(`/admin/works/${baris.id}`, { preserveScroll: true })
    }

    return (
        <AdminLayout>
            <Head title={`Works ${labelJenis[jenis]}`} />

            <PageHeader
                judul="Works"
                catatan={CATATAN[jenis]}
                aksi={
                    <Link href={`/admin/works/create?jenis=${jenis}`}>
                        <PrimaryButton type="button">Tambah</PrimaryButton>
                    </Link>
                }
            />

            <div className="mb-6 flex flex-wrap items-center gap-2">
                {JENIS.map((j) => (
                    <Pil key={j} href={`/admin/works?jenis=${j}`} aktif={j === jenis}>
                        {labelJenis[j]}
                    </Pil>
                ))}
            </div>

            {works.length === 0 ? (
                <EmptyState
                    judul={`Belum ada ${labelJenis[jenis].toLowerCase()}`}
                    catatan={CATATAN[jenis]}
                    aksi={
                        <Link href={`/admin/works/create?jenis=${jenis}`}>
                            <PrimaryButton type="button">Tambah sekarang</PrimaryButton>
                        </Link>
                    }
                />
            ) : (
                <TableCard>
                    <THead kolom={kolom} />
                    <tbody>
                        {works.map((w) => (
                            <tr key={w.id} className="border-b border-line last:border-0">
                                <td className="px-4 py-3">
                                    <Thumb
                                        src={w.thumb}
                                        alt={w.judul ?? ''}
                                        ratio={slideshow ? 'aspect-video' : horizontal ? 'aspect-[3/4]' : 'aspect-square'}
                                    />
                                </td>

                                {!slideshow ? (
                                    <>
                                        <td className="px-4 py-3 text-ink">{w.judul}</td>
                                        <td className="px-4 py-3 text-muted">{w.lokasi}</td>
                                        <td className="px-4 py-3 text-muted">{w.kategori ?? 'Belum diisi'}</td>
                                    </>
                                ) : null}

                                {horizontal ? <td className="px-4 py-3 text-muted capitalize">{w.ukuran}</td> : null}

                                <td className="px-4 py-3 text-muted">{w.urutan}</td>

                                {!slideshow ? (
                                    <td className="px-4 py-3">
                                        <Badge ok={w.punya_cover}>
                                            {w.punya_cover ? `${w.jumlah_zigzag} foto zigzag` : 'Belum ada cover'}
                                        </Badge>
                                    </td>
                                ) : null}

                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {!slideshow ? <LinkButton href={`/admin/works/${w.id}/detail`}>Foto</LinkButton> : null}
                                        <LinkButton href={`/admin/works/${w.id}/edit`}>Ubah</LinkButton>
                                        <button
                                            type="button"
                                            onClick={() => hapus(w)}
                                            className="rounded-lg border border-red-200 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-red-700 transition-colors duration-150 hover:border-red-400"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </TableCard>
            )}
        </AdminLayout>
    )
}