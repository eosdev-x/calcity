import React from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  // Initialize theme from localStorage or system preference
  const [isDark, setIsDark] = React.useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // If no saved preference, check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply theme changes and save to localStorage
  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors duration-[var(--md-sys-motion-duration-short3)]"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-on-surface" />
      ) : (
        <Moon className="w-5 h-5 text-on-surface" />
      )}
    </button>
  );
}
