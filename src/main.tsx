// Import theme initialization first to prevent theme flashing
import './utils/theme-init';

import { StrictMode, useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

/**
 * Wrapper that forces full re-mount when the tab becomes visible again
 * after being hidden for 30+ seconds. Fixes Firefox/Zen tab suspension
 * where JS state goes stale (Supabase auth, data fetches stuck in
 * loading skeleton). 30s threshold prevents flicker on quick tab switches.
 */
function Root() {
  const [mountKey, setMountKey] = useState(0);
  const hiddenAtRef = useRef<number | null>(null);

  useEffect(() => {
    const STALE_THRESHOLD_MS = 30_000;

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        hiddenAtRef.current = Date.now();
      } else if (document.visibilityState === 'visible' && hiddenAtRef.current) {
        const elapsed = Date.now() - hiddenAtRef.current;
        hiddenAtRef.current = null;
        if (elapsed >= STALE_THRESHOLD_MS) {
          setMountKey(k => k + 1);
        }
      }
    };

    // Also handle BFCache restores (always stale)
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setMountKey(k => k + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pageshow', handlePageShow);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  return (
    <StrictMode>
      <HelmetProvider>
        <App key={mountKey} />
      </HelmetProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);
