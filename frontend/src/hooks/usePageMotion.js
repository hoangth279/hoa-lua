import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Content stays visible unless an observer is available and motion is enabled.
const revealTargets = [
  '.section-heading', '.manifesto__grid', '.campaign-row', '.workshop-card',
  '.story-pillars__heading', '.story-pillar', '.campaign-detail-list > article',
  '.workshop-list__item', '.quote-band .container', '.join__inner',
];

export function usePageMotion(rootRef) {
  const { pathname } = useLocation();

  useEffect(() => {
    const root = rootRef.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!root || !('IntersectionObserver' in window)) return;

    let observer;
    let mutations;
    const prepared = new Set();
    const reset = () => {
      observer?.disconnect();
      mutations?.disconnect();
      prepared.forEach((element) => {
        element.classList.remove('motion-pending', 'motion-visible');
        element.style.removeProperty('--reveal-delay');
      });
      prepared.clear();
    };
    const start = () => {
      reset();
      if (preference.matches) return;
      observer = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          target.classList.remove('motion-pending');
          target.classList.add('motion-visible');
          observer.unobserve(target);
        });
      }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

      const prepare = () => {
        root.querySelectorAll(revealTargets.join(',')).forEach((element) => {
          if (prepared.has(element)) return;
          prepared.add(element);
          // Do not hide content already on screen, above it, or linked by an anchor.
          if (element.getBoundingClientRect().top < window.innerHeight || window.location.hash) return;
          const siblings = Array.from(element.parentElement.children);
          const index = siblings.indexOf(element);
          element.style.setProperty('--reveal-delay', `${Math.min(index % 3, 2) * 65}ms`);
          element.classList.add('motion-pending');
          observer.observe(element);
        });
      };
      prepare();
      // Workshop and article cards can arrive after the initial page render.
      mutations = new MutationObserver(prepare);
      mutations.observe(root, { childList: true, subtree: true });
    };
    start();
    preference.addEventListener('change', start);
    return () => {
      preference.removeEventListener('change', start);
      reset();
    };
  }, [pathname, rootRef]);
}
