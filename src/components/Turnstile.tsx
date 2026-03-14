import { useEffect, useRef } from 'react';

type TurnstileTheme = 'auto' | 'light' | 'dark';

type TurnstileProps = {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  theme?: TurnstileTheme;
  resetKey?: number;
};

type TurnstileOptions = {
  sitekey: string;
  callback: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: () => void;
  theme?: TurnstileTheme;
};

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement | string, options: TurnstileOptions) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

let turnstileScriptPromise: Promise<void> | null = null;

const loadTurnstileScript = () => {
  if (window.turnstile) {
    return Promise.resolve();
  }

  if (!turnstileScriptPromise) {
    turnstileScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        'script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]'
      );

      if (existing) {
        if (existing.dataset.loaded === 'true') {
          resolve();
          return;
        }

        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error('Failed to load Turnstile.')), {
          once: true,
        });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.addEventListener('load', () => {
        script.dataset.loaded = 'true';
        resolve();
      });
      script.addEventListener('error', () => reject(new Error('Failed to load Turnstile.')));
      document.head.appendChild(script);
    });
  }

  return turnstileScriptPromise;
};

export function Turnstile({ onVerify, onExpire, theme = 'auto', resetKey }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

    if (!siteKey) {
      console.warn('Missing VITE_TURNSTILE_SITE_KEY');
      return;
    }

    let isMounted = true;

    loadTurnstileScript()
      .then(() => {
        if (!isMounted || !containerRef.current || !window.turnstile) {
          return;
        }

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          callback: (token: string) => onVerifyRef.current(token),
          'expired-callback': () => onExpireRef.current?.(),
          'error-callback': () => onExpireRef.current?.(),
        });
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      isMounted = false;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [theme]);

  useEffect(() => {
    if (!widgetIdRef.current || !window.turnstile) {
      return;
    }

    window.turnstile.reset(widgetIdRef.current);
  }, [resetKey]);

  return <div ref={containerRef} className="flex justify-center [&>*]:mx-auto" />;
}
