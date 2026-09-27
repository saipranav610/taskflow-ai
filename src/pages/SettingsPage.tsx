import { Moon, Sun } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const name = user?.user_metadata?.full_name || 'User';

  return (
    <AppShell title="Settings">
      <div className="max-w-xl space-y-4">
        <Card className="flex items-center gap-4 p-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xl font-semibold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-display truncate text-base font-semibold text-gray-900 dark:text-gray-100">{name}</p>
            <p className="truncate text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 font-display text-sm font-semibold text-gray-900 dark:text-gray-100">Appearance</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-200">Theme</p>
              <p className="text-xs text-gray-400">Applies across the app and persists on this device.</p>
            </div>
            <div className="flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-white/5">
              <button
                onClick={() => theme === 'dark' && toggleTheme()}
                aria-pressed={theme === 'light'}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-theme ${
                  theme === 'light'
                    ? 'bg-white text-gray-900 shadow-soft dark:bg-white/10'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Sun className="h-3.5 w-3.5" /> Light
              </button>
              <button
                onClick={() => theme === 'light' && toggleTheme()}
                aria-pressed={theme === 'dark'}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-theme ${
                  theme === 'dark'
                    ? 'bg-white text-gray-900 shadow-soft dark:bg-white/10 dark:text-gray-100'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Moon className="h-3.5 w-3.5" /> Dark
              </button>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
