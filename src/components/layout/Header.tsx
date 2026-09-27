import { useState } from 'react';
import { Bell, Sun, Moon, Search, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function Header({
  title,
  onSearch,
}: {
  title: string;
  onSearch?: (value: string) => void;
}) {
  const { theme, toggleTheme } = useTheme();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-gray-100 bg-paper/90 backdrop-blur transition-theme dark:border-ink-500 dark:bg-ink-900/90">
      <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-8">
        {mobileSearchOpen ? (
          <div className="relative flex-1 sm:hidden">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              autoFocus
              type="text"
              placeholder="Search tasks..."
              onChange={(e) => onSearch?.(e.target.value)}
              aria-label="Search tasks"
              className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-9 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-ink-500 dark:bg-ink-600 dark:text-gray-100"
            />
            <button
              onClick={() => {
                setMobileSearchOpen(false);
                onSearch?.('');
              }}
              aria-label="Close search"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <h1 className="font-display text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
        )}

        <div className={`flex items-center gap-1.5 sm:gap-2 ${mobileSearchOpen ? 'hidden sm:flex' : ''}`}>
          {onSearch && (
            <>
              <button
                onClick={() => setMobileSearchOpen(true)}
                className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-ink-600 sm:hidden"
                aria-label="Search tasks"
              >
                <Search className="h-5 w-5" />
              </button>
              <div className="relative hidden sm:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  onChange={(e) => onSearch(e.target.value)}
                  aria-label="Search tasks"
                  className="w-56 rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-ink-500 dark:bg-ink-600 dark:text-gray-100"
                />
              </div>
            </>
          )}
          <button className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-ink-600" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </button>
          <button
            onClick={toggleTheme}
            className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-ink-600"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
