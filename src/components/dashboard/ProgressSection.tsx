import { Card } from '../ui/Card';
import type { Task } from '../../types';
import { isToday } from '../../utils/taskUtils';

export function ProgressSection({ tasks }: { tasks: Task[] }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  const todayTasks = tasks.filter((t) => isToday(t.due_date));
  const todayCompleted = todayTasks.filter((t) => t.status === 'Completed').length;
  const todayPct = todayTasks.length ? (todayCompleted / todayTasks.length) * 100 : 0;

  const circumference = 2 * Math.PI * 44;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <Card className="flex flex-col items-center gap-5 p-6 sm:flex-row sm:justify-between">
      <div className="flex items-center gap-5">
        <svg width="104" height="104" viewBox="0 0 104 104" className="shrink-0 -rotate-90">
          <circle cx="52" cy="52" r="44" fill="none" stroke="currentColor" strokeWidth="9" className="text-gray-100 dark:text-white/10" />
          <circle
            cx="52"
            cy="52"
            r="44"
            fill="none"
            stroke="currentColor"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="text-brand-600 transition-all duration-700 ease-out"
          />
          <text
            x="52"
            y="52"
            transform="rotate(90 52 52)"
            textAnchor="middle"
            dy="0.35em"
            className="fill-gray-900 font-mono text-xl font-semibold tabular-nums dark:fill-gray-100"
          >
            {pct}%
          </text>
        </svg>
        <div>
          <p className="font-display text-sm font-semibold text-gray-900 dark:text-gray-100">Overall completion</p>
          <p className="mt-0.5 font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400">
            {completed} / {total} tasks done
          </p>
        </div>
      </div>

      <div className="w-full sm:w-64">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Today</p>
          <p className="font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400">
            {todayCompleted} / {todayTasks.length}
          </p>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-700 ease-out"
            style={{ width: `${todayPct}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-gray-400">
          {todayTasks.length === 0
            ? 'Nothing due today.'
            : todayPct === 100
              ? 'All done for today. Nice work.'
              : `${todayTasks.length - todayCompleted} left today.`}
        </p>
      </div>
    </Card>
  );
}
