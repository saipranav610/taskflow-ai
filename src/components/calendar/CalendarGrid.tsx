import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { Task } from '../../types';
import { isOverdue } from '../../utils/taskUtils';

interface Props {
  tasks: Task[];
  onDayClick: (date: string) => void;
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function CalendarGrid({ tasks, onDayClick }: Props) {
  const [cursor, setCursor] = useState(new Date());

  const days = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const gridStart = new Date(year, month, 1 - startOffset);

    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      return d;
    });
  }, [cursor]);

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const t of tasks) {
      if (!t.due_date) continue;
      (map[t.due_date] ||= []).push(t);
    }
    return map;
  }, [tasks]);

  const monthLabel = cursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const currentMonth = cursor.getMonth();
  const todayISO = toISODate(new Date());

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{monthLabel}</h2>
        <div className="flex gap-1">
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-400">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const iso = toISODate(d);
          const dayTasks = tasksByDate[iso] ?? [];
          const isCurrentMonth = d.getMonth() === currentMonth;
          const isToday = iso === todayISO;
          const hasOverdue = dayTasks.some(isOverdue);

          return (
            <button
              key={iso}
              onClick={() => onDayClick(iso)}
              className={`group relative min-h-[76px] rounded-lg border p-1.5 text-left align-top transition-theme sm:min-h-[92px] ${
                isCurrentMonth
                  ? 'border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900'
                  : 'border-transparent bg-gray-50/50 dark:bg-gray-900/30'
              } ${isToday ? 'ring-2 ring-brand-500' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${isCurrentMonth ? 'text-gray-700 dark:text-gray-300' : 'text-gray-300 dark:text-gray-600'}`}>
                  {d.getDate()}
                </span>
                <Plus className="h-3 w-3 text-gray-300 opacity-0 group-hover:opacity-100" />
              </div>
              <div className="mt-1 space-y-0.5">
                {dayTasks.slice(0, 2).map((t) => (
                  <p
                    key={t.id}
                    className={`truncate rounded px-1 py-0.5 text-[10px] font-medium ${
                      isOverdue(t)
                        ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'
                        : t.priority === 'Urgent' || t.priority === 'High'
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300'
                        : 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                    }`}
                  >
                    {t.title}
                  </p>
                ))}
                {dayTasks.length > 2 && (
                  <p className="text-[10px] text-gray-400">+{dayTasks.length - 2} more</p>
                )}
                {hasOverdue && dayTasks.length === 0 && null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
