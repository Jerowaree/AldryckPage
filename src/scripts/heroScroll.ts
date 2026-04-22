import Lenis from "lenis";

let lenisInstance: Lenis | null = null;
let bootstrapped = false;

function getLenis() {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.7,
    easing: (value: number) => 1 - Math.pow(1 - value, 4),
    smoothWheel: false,
    touchMultiplier: 1.1,
  });

  if (!bootstrapped) {
    bootstrapped = true;
    const raf = (time: number) => {
      lenisInstance?.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  return lenisInstance;
}

export function initHeroScroll(triggerId: string, targetId: string) {
  const trigger = document.getElementById(triggerId);
  const target = document.getElementById(targetId);

  if (!trigger || !target) return;
  if (trigger.dataset.heroScrollReady === "1") return;
  trigger.dataset.heroScrollReady = "1";

  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
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
  });
}
