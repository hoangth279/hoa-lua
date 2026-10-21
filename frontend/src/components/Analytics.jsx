import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initGA, isGAEnabled, trackPageview } from '../lib/analytics';

function Analytics() {
  const location = useLocation();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    if (!isGAEnabled) return;
    const path = location.pathname + location.search;
    const timer = setTimeout(() => trackPageview(path, document.title), 0);
    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  return null;
}

export default Analytics;
