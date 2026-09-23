import { ListTodo, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';
import type { Task } from '../../types';
import { isOverdue } from '../../utils/taskUtils';

export function StatsCards({ tasks }: { tasks: Task[] }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const pending = tasks.filter((t) => t.status !== 'Completed').length;
  const overdue = tasks.filter(isOverdue).length;

  const stats = [
    { label: 'Total Tasks', value: total, icon: ListTodo, color: 'text-brand-600 bg-brand-50 dark:bg-brand-500/10 dark:text-brand-400' },
    { label: 'Completed', value: completed, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400' },
    { label: 'Pending', value: pending, icon: Clock, color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400' },
    { label: 'Overdue', value: overdue, icon: AlertTriangle, color: 'text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <Card key={label} className="p-4">
          <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        </Card>
      ))}
    </div>
  );
}
