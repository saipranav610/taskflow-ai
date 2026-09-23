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
      <Card className="mb-6 flex items-center gap-3 bg-gradient-to-r from-brand-600 to-brand-500 p-5 text-white">
        <Sparkles className="h-6 w-6 shrink-0" />
        <div>
          <p className="font-semibold">TaskFlow AI Assistant</p>
          <p className="text-sm text-brand-100">
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
