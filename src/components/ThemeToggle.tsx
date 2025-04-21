import React from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [isDark, setIsDark] = React.useState(() => 
    document.documentElement.classList.contains('dark')
  );

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-lg bg-desert-100 dark:bg-night-desert-400 
                 hover:bg-desert-200 dark:hover:bg-night-desert-500 
                 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-desert-100" />
      ) : (
        <Moon className="w-5 h-5 text-desert-800" />
      )}
    </button>
  );
}