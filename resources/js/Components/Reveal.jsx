import { useEffect, useRef, useState } from 'react';

/**
 * Animasi masuk saat elemen terlihat di viewport.
 * Aturan dari skill: IntersectionObserver (bukan scroll listener),
 * translateY(12px) + opacity, 600-700ms, kurva ease-out kustom,
 * dan hormati prefers-reduced-motion.
 */
export default function Reveal({ children, className = '' }) {
    const ref = useRef(null);
    const [tampil, setTampil] = useState(false);

    useEffect(() => {
        // Pengguna yang sensitif gerak: langsung tampil tanpa animasi
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setTampil(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTampil(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: tampil ? 1 : 0,
                transform: tampil ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
        >
            {children}
        </div>
    );
}