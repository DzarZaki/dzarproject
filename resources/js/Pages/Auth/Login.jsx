import { useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    function submit(e) {
        e.preventDefault();
        post('/login');
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-bone px-4">
            <div className="w-full max-w-sm">
                <div className="flex flex-col items-center">
                    <img src="/images/logo.png" alt="Logo DzarProject" className="h-14 w-auto" />
                    <h1 className="mt-4 font-serif text-3xl tracking-[-0.02em] text-ink">
                        Masuk Admin
                    </h1>
                    <p className="mt-1 text-sm text-muted">Panel kelola DzarProject</p>
                </div>

                <form
                    onSubmit={submit}
                    className="mt-8 space-y-4 rounded-md border border-line bg-white p-6"
                >
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-ink">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="mt-1.5 w-full rounded-md border border-line px-3 py-2 text-sm transition-colors duration-150 focus:border-ink focus:outline-none"
                            autoFocus
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-700">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-ink">
                            Kata Sandi
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-1.5 w-full rounded-md border border-line px-3 py-2 text-sm transition-colors duration-150 focus:border-ink focus:outline-none"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-700">{errors.password}</p>
                        )}
                    </div>

                    <label className="flex items-center gap-2 text-sm text-muted">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        Ingat saya
                    </label>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-md bg-ink py-2.5 text-sm text-white transition-colors duration-150 hover:bg-neutral-800 disabled:opacity-50"
                    >
                        {processing ? 'Memproses…' : 'Masuk'}
                    </button>
                </form>
            </div>
        </main>
    );
}