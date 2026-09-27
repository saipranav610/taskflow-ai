import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export function AppShell({
  title,
  onSearch,
  children,
}: {
  title: string;
  onSearch?: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-paper dark:bg-ink-900 transition-theme">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={title} onSearch={onSearch} />
        <main
          key={title}
          className="flex-1 overflow-y-auto animate-fade-in p-4 pb-[max(6rem,calc(env(safe-area-inset-bottom,0px)+5rem))] lg:p-8"
        >
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
