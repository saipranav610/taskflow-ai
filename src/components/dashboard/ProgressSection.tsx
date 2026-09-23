import { Card } from '../ui/Card';
import type { Task } from '../../types';
import { isToday } from '../../utils/taskUtils';

export function ProgressSection({ tasks }: { tasks: Task[] }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  const todayTasks = tasks.filter((t) => isToday(t.due_date));
  const todayCompleted = todayTasks.filter((t) => t.status === 'Completed').length;

  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <Card className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:justify-between">
      <div className="flex items-center gap-4">
        <svg width="96" height="96" viewBox="0 0 96 96" className="shrink-0 -rotate-90">
          <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-100 dark:text-gray-800" />
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="text-brand-600 transition-all duration-500"
          />
          <text x="48" y="48" transform="rotate(90 48 48)" textAnchor="middle" dy="0.35em" className="fill-gray-900 dark:fill-gray-100 text-lg font-bold rotate-90">
            {pct}%
          </text>
        </svg>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Overall completion</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {completed} of {total} tasks completed
          </p>
        </div>
      </div>

      <div className="w-full sm:w-64">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {todayCompleted} of {todayTasks.length} tasks completed today
        </p>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className="h-full rounded-full bg-brand-600 transition-all duration-500"
            style={{ width: `${todayTasks.length ? (todayCompleted / todayTasks.length) * 100 : 0}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
