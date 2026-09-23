import { useState } from 'react';
import { Lightbulb, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { aiService } from '../../services/aiService';
import type { Task } from '../../types';

export function ProductivityInsights({ tasks }: { tasks: Task[] }) {
  const [insights, setInsights] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    setLoading(true);
    setError('');
    try {
      const res = await aiService.getInsights(tasks);
      setInsights(res.insights);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate insights right now.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Productivity Insights</h3>
        <Button variant="secondary" size="sm" onClick={handleGenerate} loading={loading} icon={<Sparkles className="h-4 w-4" />}>
          Generate
        </Button>
      </div>

      {error && <p className="mt-3 text-xs text-red-600 dark:text-red-400">{error}</p>}

      {insights && (
        <ul className="mt-4 space-y-2">
          {insights.map((insight, i) => (
            <li key={i} className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 p-3 text-sm text-amber-900 dark:text-amber-200">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" />
              {insight}
            </li>
          ))}
        </ul>
      )}

      {!insights && !loading && (
        <p className="mt-3 text-sm text-gray-400">Generate insights based on your actual task data and history.</p>
      )}
    </Card>
  );
}
