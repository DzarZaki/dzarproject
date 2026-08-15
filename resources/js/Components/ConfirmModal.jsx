export default function ConfirmModal({ open, judul, pesan, onConfirm, onClose }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
            <div
                className="relative w-full max-w-sm rounded-md border border-line bg-white p-6"
                style={{ animation: 'dropdownMasuk 200ms cubic-bezier(0.23, 1, 0.32, 1)' }}
            >
                <h2 className="font-serif text-xl tracking-[-0.02em] text-ink">{judul}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{pesan}</p>
                <div className="mt-6 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="rounded-md border border-line px-4 py-2 text-sm text-muted transition-colors duration-150 hover:text-ink"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        className="rounded-md bg-red-700 px-4 py-2 text-sm text-white transition-colors duration-150 hover:bg-red-800"
                    >
                        Ya, Hapus
                    </button>
                </div>
            </div>
        </div>
    );
}