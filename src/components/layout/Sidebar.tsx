import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ListChecks,
  Calendar,
  Sparkles,
  FolderKanban,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'My Tasks', icon: ListChecks },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/ai-planner', label: 'AI Planner', icon: Sparkles },
  { to: '/categories', label: 'Categories', icon: FolderKanban },
  { to: '/settings', label: 'Settings', icon: Settings },
];

// Desktop-only rail; mobile uses BottomNav instead of an off-canvas drawer.
export function Sidebar() {
  const { user, signOut } = useAuth();

  return (
    <aside className="hidden lg:flex h-full w-64 shrink-0 flex-col border-r border-gray-100 bg-paper-card dark:border-white/10 dark:bg-white/[0.03] dark:backdrop-blur-xl">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orb-gradient text-ink-900 shadow-glow dark:shadow-glow">
          <Sparkles className="h-4 w-4" />
        </div>
        <span className="font-display text-lg font-semibold text-gray-900 dark:text-gray-100">TaskFlow AI</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-theme ${
                isActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-400/10 dark:text-brand-300 dark:shadow-glow'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5'
              }`
            }
          >
            <Icon className="h-4.5 w-4.5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-100 dark:border-white/10 px-3 py-4">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-400/20 text-sm font-semibold text-brand-700 dark:text-brand-300">
            {(user?.user_metadata?.full_name || user?.email || '?').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
              {user?.user_metadata?.full_name || 'User'}
            </p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}
