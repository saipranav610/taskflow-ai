import { Menu, Bell, Sun, Moon, Search } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function Header({
  title,
  onOpenMobileMenu,
  onSearch,
}: {
  title: string;
  onOpenMobileMenu: () => void;
  onSearch?: (value: string) => void;
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur px-4 py-3 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          onClick={onOpenMobileMenu}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {onSearch && (
          <div className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              onChange={(e) => onSearch(e.target.value)}
              aria-label="Search tasks"
              className="w-56 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-2 pl-9 pr-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        )}
        <button
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
}
