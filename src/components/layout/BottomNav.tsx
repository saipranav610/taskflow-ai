import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ListChecks,
  Calendar,
  Plus,
  Grid2x2,
  Sparkles,
  FolderKanban,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const TABS = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks', icon: ListChecks },
];

const TABS_RIGHT = [{ to: '/calendar', label: 'Calendar', icon: Calendar }];

const MORE_LINKS = [
  { to: '/ai-planner', label: 'AI Planner', icon: Sparkles },
  { to: '/categories', label: 'Categories', icon: FolderKanban },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const tabClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium transition-theme ${
    isActive ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400 dark:text-gray-500'
  }`;

export function BottomNav() {
  const [moreOpen, setMoreOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-gray-100 bg-paper-card/95 backdrop-blur dark:border-ink-500 dark:bg-ink-700/95 lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {TABS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={tabClass}>
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}

        {/* Elevated center FAB: primary action, always one tap away */}
        <div className="flex flex-1 items-start justify-center">
          <button
            onClick={() => navigate('/tasks?new=1')}
            aria-label="Add task"
            className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-fab transition-theme hover:bg-brand-700 active:scale-95"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>

        {TABS_RIGHT.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={tabClass}>
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}

        <button
          onClick={() => setMoreOpen(true)}
          className={`flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium transition-theme ${
            moreOpen ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          <Grid2x2 className="h-5 w-5" />
          More
        </button>
      </nav>

      {moreOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-ink-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMoreOpen(false)}
        >
          <div
            className="w-full animate-sheet-in rounded-t-3xl bg-paper-card p-3 dark:bg-ink-700"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-gray-200 dark:bg-ink-500" />
            <div className="flex items-center justify-between px-2 pb-2">
              <h2 className="font-display text-sm font-semibold text-gray-900 dark:text-gray-100">More</h2>
              <button
                onClick={() => setMoreOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-ink-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-1">
              {MORE_LINKS.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMoreOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-theme ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-ink-600'
                    }`
                  }
                >
                  <Icon className="h-4.5 w-4.5" />
                  {label}
                </NavLink>
              ))}
              <button
                onClick={signOut}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-ember-600 hover:bg-ember-50 dark:text-ember-400 dark:hover:bg-ember-500/10"
              >
                <LogOut className="h-4.5 w-4.5" />
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
