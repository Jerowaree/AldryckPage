import { useEffect, type MouseEvent } from "react";
import Lenis from "lenis";

type Props = {
  targetId: string;
  className?: string;
};

let lenisInstance: Lenis | null = null;
let isRafStarted = false;

function getLenis() {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.7,
    easing: (value: number) => 1 - Math.pow(1 - value, 4),
    smoothWheel: false,
    touchMultiplier: 1.1,
  });

  if (!isRafStarted) {
    isRafStarted = true;
    const raf = (time: number) => {
      lenisInstance?.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  return lenisInstance;
}

export default function HeroScrollArrow({ targetId, className = "" }: Props) {
  useEffect(() => {
    return () => {
      // Mantiene una sola instancia global para evitar comportamientos inconsistentes.
    };
  }, []);

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const target = document.getElementById(targetId);
    if (!target) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      target.scrollIntoView({ behavior: "auto", block: "start" });
      return;
    }

    try {
      const lenis = getLenis();
      lenis.scrollTo(target, { offset: -18, duration: 1.7 });
    } catch {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={onClick}
      className={className}
      aria-label="Bajar a la sección de trabajo"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-9 w-9 motion-safe:animate-arrow-float"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6"></path>
      </svg>
    </a>
  );
}
