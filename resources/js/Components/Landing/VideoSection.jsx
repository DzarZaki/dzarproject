import { useCallback, useEffect, useRef, useState } from 'react'

const ASAL_YT = 'https://www.youtube.com'

/* controls=0 menyembunyikan garis waktu dan panel kendali bawah, tapi tetap
   membiarkan nama kanal, tombol jeda, tombol bagikan, dan tawaran video lain.
   disablekb=1 mematikan pintasan papan tuts supaya waktu tidak bisa digeser. */
const PARAM_DASAR = [
    'controls=0',
    'disablekb=1',
    'fs=0',
    'rel=0',
    'playsinline=1',
    'autoplay=1',
    'loop=1',
    'enablejsapi=1',
    'iv_load_policy=3',
    'cc_load_policy=0',
].join('&')

/* Ambil kode video dari alamat embed, dipakai untuk loop=1 yang butuh playlist. */
function kodeVideo(embedUrl) {
    if (typeof embedUrl !== 'string') return ''

    const potong = embedUrl.split('?')[0].split('/')
    return potong[potong.length - 1] ?? ''
}

function Video({ video, bersuara, saatMintaSuara }) {
    const bingkai = useRef(null)
    const jedaSengaja = useRef(false)
    const [siap, setSiap] = useState(false)

    const kode = kodeVideo(video.embed_url)

    const kirim = useCallback((perintah, nilai = []) => {
        const el = bingkai.current
        if (!el || !el.contentWindow) return

        el.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: perintah, args: nilai }),
            ASAL_YT,
        )
    }, [])

    /* Suara mengikuti tombol milik kita sendiri, tanpa memuat ulang pemutar,
       jadi video tidak pernah kembali ke detik nol. */
    useEffect(() => {
        if (!siap) return

        if (bersuara) {
            kirim('unMute')
            kirim('setVolume', [100])
        } else {
            kirim('mute')
        }
    }, [bersuara, siap, kirim])

    /* Video jalan sendiri sejak halaman dibuka dan mengulang otomatis.
       Kalau pengunjung menjeda sendiri, jedanya dihormati. */
    useEffect(() => {
        if (!siap) return

        const el = bingkai.current

        if (el && el.contentWindow) {
            el.contentWindow.postMessage(
                JSON.stringify({ event: 'listening', id: `dzar-${video.id}` }),
                ASAL_YT,
            )
        }

        kirim('playVideo')

        const saatPesan = (peristiwa) => {
            if (peristiwa.origin !== ASAL_YT) return
            if (typeof peristiwa.data !== 'string') return

            let isi = null

            try {
                isi = JSON.parse(peristiwa.data)
            } catch {
                return
            }

            const keadaan = isi?.info?.playerState

            /* 2 berarti jeda, 1 berarti jalan. */
            if (keadaan === 2 && !document.hidden) jedaSengaja.current = true
            if (keadaan === 1) jedaSengaja.current = false
        }

        const saatTampil = () => {
            if (!document.hidden && !jedaSengaja.current) kirim('playVideo')
        }

        window.addEventListener('message', saatPesan)
        document.addEventListener('visibilitychange', saatTampil)

        return () => {
            window.removeEventListener('message', saatPesan)
            document.removeEventListener('visibilitychange', saatTampil)
        }
    }, [siap, kirim, video.id])

    const alamat = `${video.embed_url}?${PARAM_DASAR}&mute=1&playlist=${kode}`

    return (
        <article>
            <div className="relative aspect-video w-full overflow-hidden bg-black">
                <iframe
                    ref={bingkai}
                    src={alamat}
                    title={video.judul ?? 'Video'}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    onLoad={() => setSiap(true)}
                    className="absolute inset-0 h-full w-full border-0"
                />
            </div>

            <div className="mt-3 flex items-baseline justify-between gap-4 text-[10px] uppercase tracking-[0.18em]">
                <span className="text-ink">{video.judul}</span>
                <button
                    type="button"
                    onClick={() => saatMintaSuara(bersuara ? null : video.id)}
                    className="text-muted transition-opacity duration-150 hover:opacity-60"
                >
                    {bersuara ? 'Matikan suara' : 'Nyalakan suara'}
                </button>
            </div>
        </article>
    )
}

export default function VideoSection({ videos = [] }) {
    /* Hanya satu video yang boleh bersuara agar tidak bertumpuk. */
    const [idBersuara, setIdBersuara] = useState(null)

    if (videos.length === 0) return null

    return (
        <section className="bg-bone px-6 pb-24 pt-16 md:px-10 md:pb-32">
            <div className="mx-auto grid max-w-5xl gap-16">
                {videos.map((v) => (
                    <Video
                        key={v.id}
                        video={v}
                        bersuara={idBersuara === v.id}
                        saatMintaSuara={setIdBersuara}
                    />
                ))}
            </div>
        </section>
    )
}