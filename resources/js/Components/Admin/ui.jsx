// Primitif UI admin — satu sumber tampilan untuk semua halaman admin.
// Aturan (dari minimalist-skill): flat, border 1px #EAEAEA, tanpa shadow,
// rounded tajam (maks 6-8px), warna dari token, transisi < 200ms.

export function PageHeader({ judul, deskripsi, children }) {
    return (
        <div className="flex items-end justify-between border-b border-line pb-5">
            <div>
                <h1 className="font-serif text-3xl tracking-[-0.02em] text-ink">{judul}</h1>
                {deskripsi && <p className="mt-1 text-sm text-muted">{deskripsi}</p>}
            </div>
            {children}
        </div>
    );
}

export function Card({ children, className = '' }) {
    return <div className={`rounded-md border border-line bg-white ${className}`}>{children}</div>;
}

export function Field({ label, error, hint, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-ink">{label}</label>
            <div className="mt-1.5">{children}</div>
            {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
            {error && <p className="mt-1 text-sm text-red-700">{error}</p>}
        </div>
    );
}

export const inputKelas =
    'w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-muted transition-colors duration-150 focus:border-ink focus:outline-none';

export function TextInput(props) {
    return <input {...props} className={inputKelas} />;
}

export function SelectInput({ children, ...props }) {
    return (
        <select {...props} className={inputKelas}>
            {children}
        </select>
    );
}

export function AreaInput({ rows = 4, ...props }) {
    return <textarea rows={rows} {...props} className={inputKelas} />;
}

export function PrimaryButton({ children, ...props }) {
    return (
        <button
            {...props}
            className="rounded-md bg-ink px-4 py-2 text-sm text-white transition-colors duration-150 hover:bg-neutral-800 disabled:opacity-50"
        >
            {children}
        </button>
    );
}

export function DangerButton({ children, ...props }) {
    return (
        <button
            {...props}
            className="rounded-md border border-red-200 px-4 py-2 text-sm text-red-700 transition-colors duration-150 hover:bg-red-50"
        >
            {children}
        </button>
    );
}

export function TableCard({ children }) {
    return (
        <div className="overflow-hidden rounded-md border border-line bg-white">
            <table className="w-full text-sm">{children}</table>
        </div>
    );
}

export function THead({ children }) {
    return (
        <thead>
            <tr className="border-b border-line text-left text-xs tracking-[0.15em] text-muted uppercase">
                {children}
            </tr>
        </thead>
    );
}

export function EmptyState({ children }) {
    return <p className="py-10 text-center text-sm text-muted">{children}</p>;
}