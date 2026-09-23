import { Moon, Sun } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <AppShell title="Settings">
      <div className="max-w-xl space-y-6">
        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Profile</h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p>
              <span className="text-gray-400">Name: </span>
              {user?.user_metadata?.full_name || '—'}
            </p>
            <p>
              <span className="text-gray-400">Email: </span>
              {user?.email}
            </p>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Appearance</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-200">Theme</p>
              <p className="text-xs text-gray-400">Currently using {theme} mode.</p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              Switch to {theme === 'dark' ? 'light' : 'dark'} mode
            </button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
