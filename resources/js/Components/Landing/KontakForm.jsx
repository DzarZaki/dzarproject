import { useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function KontakForm() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        nama: '',
        email: '',
        no_wa: '',
        pesan: '',
        alamat_web: '', // honeypot — sengaja kosong, jangan diisi
    });

    // Setelah server memvalidasi, buka WhatsApp di tab baru
    useEffect(() => {
        if (flash?.wa_url) {
            window.open(flash.wa_url, '_blank');
            reset();
        }
    }, [flash?.wa_url]);

    function submit(e) {
        e.preventDefault();
        post('/kontak', { preserveScroll: true });
    }

    const inputKelas =
        'mt-1 w-full rounded border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-neutral-500 focus:border-white/60 focus:outline-none';

    return (
        <form onSubmit={submit} className="mt-10 space-y-4 text-left">
            <div>
                <label htmlFor="nama" className="block text-sm">Nama</label>
                <input
                    id="nama"
                    type="text"
                    value={data.nama}
                    onChange={(e) => setData('nama', e.target.value)}
                    className={inputKelas}
                    placeholder="Nama kamu"
                />
                {errors.nama && <p className="mt-1 text-sm text-red-400">{errors.nama}</p>}
            </div>

            <div>
                <label htmlFor="email" className="block text-sm">Email</label>
                <input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className={inputKelas}
                    placeholder="nama@email.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
            </div>

            <div>
                <label htmlFor="no_wa" className="block text-sm">No. WhatsApp</label>
                <input
                    id="no_wa"
                    type="text"
                    value={data.no_wa}
                    onChange={(e) => setData('no_wa', e.target.value)}
                    className={inputKelas}
                    placeholder="08xxxxxxxxxx"
                />
                {errors.no_wa && <p className="mt-1 text-sm text-red-400">{errors.no_wa}</p>}
            </div>

            <div>
                <label htmlFor="pesan" className="block text-sm">Pesan</label>
                <textarea
                    id="pesan"
                    rows="4"
                    value={data.pesan}
                    onChange={(e) => setData('pesan', e.target.value)}
                    className={inputKelas}
                    placeholder="Ceritakan kebutuhan fotomu…"
                />
                {errors.pesan && <p className="mt-1 text-sm text-red-400">{errors.pesan}</p>}
            </div>

            {/* Honeypot: tidak terlihat manusia, terisi hanya oleh bot */}
            <div className="hidden" aria-hidden="true">
                <label htmlFor="alamat_web">Alamat Website</label>
                <input
                    id="alamat_web"
                    type="text"
                    value={data.alamat_web}
                    onChange={(e) => setData('alamat_web', e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                />
            </div>

            <button
                type="submit"
                disabled={processing}
                className="w-full rounded bg-white py-3 text-sm font-medium tracking-widest text-neutral-900 uppercase transition hover:bg-neutral-200 disabled:opacity-50"
            >
                {processing ? 'Memproses…' : 'Get in Touch'}
            </button>
        </form>
    );
}