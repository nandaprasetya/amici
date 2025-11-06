import React, { useEffect, useRef } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const scroll = new LocomotiveScroll({
            el: containerRef.current,
            smooth: true,
            lerp: 0.1,
        });

        setTimeout(() => {
            scroll.update();
        }, 1000);

        return () => {
            scroll.destroy();
        };
    }, []);

    return (
        <div data-scroll-container ref={containerRef}>
            {children}
        </div>
    );
}
