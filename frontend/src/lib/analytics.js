const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

const isProdHost = typeof window !== 'undefined' && /(^|\.)hoalua\.online$/.test(window.location.hostname);

export const isGAEnabled = Boolean(MEASUREMENT_ID) && isProdHost;

let initialized = false;

export function initGA() {
  if (!isGAEnabled || initialized) return;
  initialized = true;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID, { send_page_view: false });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export function trackPageview(path, title) {
  if (!isGAEnabled || typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
}

export function trackEvent(name, params = {}) {
  if (!isGAEnabled || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}
