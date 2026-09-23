import { useState } from 'react';
import { Sparkles, Coffee } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { aiService } from '../../services/aiService';
import type { AIPlanItem, Task } from '../../types';

export function PlanMyDay({ tasks }: { tasks: Task[] }) {
  const [plan, setPlan] = useState<AIPlanItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handlePlan() {
    setLoading(true);
    setError('');
    try {
      const res = await aiService.planMyDay(tasks);
      setPlan(res.plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate a plan right now.');
    } finally {
      setLoading(false);
    }
  }

  const incompleteCount = tasks.filter((t) => t.status !== 'Completed').length;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Plan My Day</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {incompleteCount} pending task{incompleteCount === 1 ? '' : 's'} to work with
          </p>
        </div>
        <Button onClick={handlePlan} loading={loading} icon={<Sparkles className="h-4 w-4" />} disabled={incompleteCount === 0}>
          Plan My Day
        </Button>
      </div>

      {error && <p className="mt-3 text-xs text-red-600 dark:text-red-400">{error}</p>}

      {plan && (
        <div className="mt-4 space-y-2 border-t border-gray-100 dark:border-gray-800 pt-4">
          <p className="text-xs text-gray-400">This is a suggestion — nothing has been scheduled or changed.</p>
          <ol className="space-y-2">
            {plan.map((item, i) => (
              <li
                key={i}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                  item.is_break
                    ? 'bg-gray-50 text-gray-500 dark:bg-gray-800/50 dark:text-gray-400'
                    : 'bg-brand-50 text-brand-900 dark:bg-brand-500/10 dark:text-brand-200'
                }`}
              >
                <span className="w-20 shrink-0 text-xs font-semibold">{item.time}</span>
                {item.is_break ? <Coffee className="h-4 w-4 shrink-0" /> : <Sparkles className="h-4 w-4 shrink-0" />}
                <span className="flex-1">{item.task_title}</span>
                <span className="text-xs text-gray-400">{item.duration_minutes}m</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Card>
  );
}
