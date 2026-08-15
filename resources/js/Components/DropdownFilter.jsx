import { useEffect, useRef, useState } from 'react';

/**
 * Dropdown filter ala ILUMINEN ("All Services").
 * Aturan dari skill animasi: dropdown masuk dengan ease-out kuat, < 250ms.
 */
export default function DropdownFilter({ label, semuaLabel, options, nilaiAktif, onPilih }) {
    const [buka, setBuka] = useState(false);
    const ref = useRef(null);

    // Tutup saat klik di luar dropdown
    useEffect(() => {
        function onKlikLuar(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setBuka(false);
            }
        }
        document.addEventListener('mousedown', onKlikLuar);
        return () => document.removeEventListener('mousedown', onKlikLuar);
    }, []);

    // Tutup saat tekan Escape (aksesibilitas)
    useEffect(() => {
        function onEscape(e) {
            if (e.key === 'Escape') setBuka(false);
        }
        document.addEventListener('keydown', onEscape);
        return () => document.removeEventListener('keydown', onEscape);
    }, []);

    const labelAktif = options.find((o) => o.value === nilaiAktif)?.label ?? semuaLabel;

    const itemKelas = (aktif) =>
        `block w-full px-4 py-2 text-left text-sm transition-colors duration-150 ${
            aktif ? 'bg-bone font-medium text-ink' : 'text-muted hover:bg-bone hover:text-ink'
        }`;

    function pilih(value) {
        setBuka(false);
        onPilih(value);
    }

    return (
        <div ref={ref} className="relative inline-block text-left">
            <button
                type="button"
                onClick={() => setBuka(!buka)}
                aria-expanded={buka}
                className="flex items-center gap-2 border-b border-line pb-1 text-sm"
            >
                <span className="text-muted">{label}:</span>
                <span className="text-ink">{labelAktif}</span>
                <span
                    className="text-xs text-muted transition-transform duration-200"
                    style={{ transform: buka ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                    ▾
                </span>
            </button>

            {buka && (
                <div
                    className="absolute left-0 z-30 mt-2 w-52 rounded-sm border border-line bg-white py-1"
                    style={{ animation: 'dropdownMasuk 180ms cubic-bezier(0.23, 1, 0.32, 1)' }}
                >
                    <button onClick={() => pilih(null)} className={itemKelas(!nilaiAktif)}>
                        {semuaLabel}
                    </button>
                    {options.map((o) => (
                        <button key={o.value} onClick={() => pilih(o.value)} className={itemKelas(nilaiAktif === o.value)}>
                            {o.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}