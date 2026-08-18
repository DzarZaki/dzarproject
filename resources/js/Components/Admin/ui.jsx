import { Link } from '@inertiajs/react'

export const inputKelas =
    'w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition-colors duration-150 placeholder:text-muted/60 focus:border-ink/40 disabled:bg-bone'

export const fileKelas =
    'block w-full cursor-pointer text-sm text-muted file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-ink file:px-3 file:py-2 file:text-[11px] file:uppercase file:tracking-[0.14em] file:text-white'

export function PageHeader({ judul, catatan, aksi }) {
    return (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
                <h1 className="font-serif text-2xl text-ink">{judul}</h1>
                {catatan ? <p className="mt-1 max-w-xl text-sm text-muted">{catatan}</p> : null}
            </div>
            {aksi ? <div className="flex items-center gap-2">{aksi}</div> : null}
        </div>
    )
}

export function Card({ children, className = '' }) {
    return <div className={`rounded-xl border border-line bg-white p-6 ${className}`}>{children}</div>
}

export function Field({ label, wajib = false, error, petunjuk, children }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-muted">
                {label}
                {wajib ? <span className="ml-1 text-red-600">*</span> : null}
            </span>
            {children}
            {petunjuk && !error ? <span className="mt-1.5 block text-xs text-muted">{petunjuk}</span> : null}
            {error ? <span className="mt-1.5 block text-xs text-red-600">{error}</span> : null}
        </label>
    )
}

export function TextInput({ className = '', ...props }) {
    return <input {...props} className={`${inputKelas} ${className}`} />
}

export function SelectInput({ className = '', children, ...props }) {
    return (
        <select {...props} className={`${inputKelas} ${className}`}>
            {children}
        </select>
    )
}

export function AreaInput({ className = '', rows = 5, ...props }) {
    return <textarea {...props} rows={rows} className={`${inputKelas} ${className}`} />
}

export function FileInput({ className = '', ...props }) {
    return <input type="file" {...props} className={`${fileKelas} ${className}`} />
}

export function PrimaryButton({ children, className = '', ...props }) {
    return (
        <button
            {...props}
            className={`inline-flex items-center justify-center rounded-lg bg-ink px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-white transition-opacity duration-150 hover:opacity-80 disabled:opacity-40 ${className}`}
        >
            {children}
        </button>
    )
}

export function GhostButton({ children, className = '', ...props }) {
    return (
        <button
            {...props}
            className={`inline-flex items-center justify-center rounded-lg border border-line px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-ink transition-colors duration-150 hover:border-ink/40 disabled:opacity-40 ${className}`}
        >
            {children}
        </button>
    )
}

export function DangerButton({ children, className = '', ...props }) {
    return (
        <button
            {...props}
            className={`inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-red-700 transition-colors duration-150 hover:border-red-400 disabled:opacity-40 ${className}`}
        >
            {children}
        </button>
    )
}

export function LinkButton({ href, children, className = '' }) {
    return (
        <Link
            href={href}
            className={`inline-flex items-center justify-center rounded-lg border border-line px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-ink transition-colors duration-150 hover:border-ink/40 ${className}`}
        >
            {children}
        </Link>
    )
}

export function TableCard({ children }) {
    return (
        <div className="overflow-hidden rounded-xl border border-line bg-white">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">{children}</table>
            </div>
        </div>
    )
}

export function THead({ kolom }) {
    return (
        <thead>
            <tr className="border-b border-line bg-bone/60">
                {kolom.map((k) => (
                    <th key={k} className="px-4 py-3 text-[11px] font-normal uppercase tracking-[0.14em] text-muted">
                        {k}
                    </th>
                ))}
            </tr>
        </thead>
    )
}

export function EmptyState({ judul, catatan, aksi }) {
    return (
        <div className="rounded-xl border border-dashed border-line bg-white px-6 py-14 text-center">
            <p className="font-serif text-lg text-ink">{judul}</p>
            {catatan ? <p className="mx-auto mt-2 max-w-md text-sm text-muted">{catatan}</p> : null}
            {aksi ? <div className="mt-5 flex justify-center">{aksi}</div> : null}
        </div>
    )
}

export function Pil({ href, aktif = false, children }) {
    return (
        <Link
            href={href}
            preserveScroll
            className={`rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-[0.14em] transition-colors duration-150 ${
                aktif ? 'border-ink bg-ink text-white' : 'border-line bg-white text-muted hover:border-ink/40 hover:text-ink'
            }`}
        >
            {children}
        </Link>
    )
}

export function Badge({ ok = false, children }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] ${
                ok ? 'bg-[#edf3ec] text-[#346538]' : 'bg-[#fbf3db] text-[#956400]'
            }`}
        >
            {children}
        </span>
    )
}

export function Thumb({ src, alt = '', ratio = 'aspect-[4/3]' }) {
    if (!src) {
        return <div className={`w-24 ${ratio} rounded-md border border-dashed border-line bg-bone`} />
    }

    return (
        <div className={`w-24 ${ratio} overflow-hidden rounded-md border border-line bg-bone`}>
            <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
        </div>
    )
}