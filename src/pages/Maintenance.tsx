import { siteConfig } from '../config/site';

export function Maintenance() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
    >
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
            style={{ backgroundColor: siteConfig.seedColor + '22', border: `2px solid ${siteConfig.seedColor}` }}
          >
            <span className="text-4xl">🏗️</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            We're Getting Ready
          </h1>
          <p className="text-lg text-gray-300 mb-2">
            {siteConfig.name} is being upgraded with new features.
          </p>
          <p className="text-gray-400">
            We'll be back shortly with a better experience for {siteConfig.city}.
          </p>
        </div>

        <div
          className="rounded-2xl p-6 mb-8"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
            What's Coming
          </h2>
          <ul className="space-y-3 text-left text-gray-300">
            <li className="flex items-start gap-3">
              <span className="mt-0.5" style={{ color: siteConfig.seedColor }}>✦</span>
              <span>Enhanced business listings with new features</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5" style={{ color: siteConfig.seedColor }}>✦</span>
              <span>Local job board for {siteConfig.city} businesses</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5" style={{ color: siteConfig.seedColor }}>✦</span>
              <span>Improved security and performance</span>
            </li>
          </ul>
        </div>

        <p className="text-sm text-gray-500">
          Questions? Email{' '}
          <a href="mailto:help@tux.st" className="underline" style={{ color: siteConfig.seedColor }}>
            help@tux.st
          </a>
        </p>
      </div>
    </div>
  );
}
