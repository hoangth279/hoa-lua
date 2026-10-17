import { useLayoutEffect, useRef } from 'react';

// Fit both editorial lines at the same size, using the actual loaded font.
export function useFittedTitle(title) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const heading = ref.current;
    if (!heading) return;
    let active = true;
    let previousWidth = -1;

    const fit = () => {
      if (!active) return;
      const available = heading.getBoundingClientRect().width;
      if (available <= 0) return;
      heading.style.removeProperty('font-size');
      const baseSize = parseFloat(getComputedStyle(heading).fontSize);
      const widest = Math.max(...Array.from(heading.children, (line) => line.getBoundingClientRect().width));
      if (widest > available) {
        // Leave a little room for fractional-pixel rounding.
        heading.style.fontSize = `${baseSize * (available - 1) / widest}px`;
      }
    };

    fit();
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width === previousWidth) return;
      previousWidth = entry.contentRect.width;
      fit();
    });
    observer.observe(heading);
    document.fonts.ready.then(fit);
    document.fonts.addEventListener('loadingdone', fit);

    return () => {
      active = false;
      observer.disconnect();
      document.fonts.removeEventListener('loadingdone', fit);
    };
  }, [title]);

  return ref;
}
