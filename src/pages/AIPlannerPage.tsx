import { Sparkles } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PlanMyDay } from '../components/ai/PlanMyDay';
import { ProductivityInsights } from '../components/ai/ProductivityInsights';
import { Card } from '../components/ui/Card';
import { useTasks } from '../hooks/useTasks';

export default function AIPlannerPage() {
  const { tasks, loading } = useTasks();

  return (
    <AppShell title="AI Planner">
      <Card className="relative mb-6 flex items-center gap-4 overflow-hidden p-5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orb-gradient opacity-0 blur-2xl dark:opacity-30"
        />
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orb-gradient text-ink-900 shadow-glow">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="relative">
          <p className="font-display font-semibold text-gray-900 dark:text-gray-100">TaskFlow AI Assistant</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            AI suggestions here are never applied automatically — you always review and approve them first.
          </p>
        </div>
      </Card>

      {loading ? (
        <p className="text-sm text-gray-400">Loading tasks...</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PlanMyDay tasks={tasks} />
          <ProductivityInsights tasks={tasks} />
        </div>
      )}
    </AppShell>
  );
}
