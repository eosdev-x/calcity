// Import theme initialization first to prevent theme flashing
import './utils/theme-init';

import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

/**
 * Wrapper that forces full re-mount when the page is restored from
 * Firefox/Zen BFCache. Without this, useEffect hooks in page components
 * don't re-run and data fetches stay stuck in loading skeleton state.
 */
function Root() {
  const [mountKey, setMountKey] = useState(0);

  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setMountKey(k => k + 1);
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
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
