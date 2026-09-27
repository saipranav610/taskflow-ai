import { Check, Clock, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Category, Task } from '../../types';
import { Badge } from '../ui/Badge';
import { formatDueDate, formatDuration, isOverdue, priorityAccent, priorityColor } from '../../utils/taskUtils';

interface TaskCardProps {
  task: Task;
  category?: Category;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, category, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const overdue = isOverdue(task);
  const completed = task.status === 'Completed';
  const dueLabel = formatDueDate(task.due_date);
  const durationLabel = formatDuration(task.estimated_duration);

  return (
    <div
      className={`group relative flex items-start gap-3 overflow-hidden rounded-2xl border pl-4 pr-3 py-3.5 transition-theme ${
        overdue
          ? 'border-ember-200 bg-ember-50/40 dark:border-ember-500/30 dark:bg-ember-500/5'
          : 'border-gray-100 bg-paper-card dark:border-ink-500 dark:bg-ink-700'
      }`}
    >
      {/* Priority signal, encoded structurally rather than only as a badge */}
      <span className={`absolute inset-y-0 left-0 w-1 ${priorityAccent(task.priority)}`} aria-hidden="true" />

      <button
        onClick={() => onToggleComplete(task)}
        aria-label={completed ? 'Mark as not completed' : 'Mark as completed'}
        aria-pressed={completed}
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-theme ${
          completed
            ? 'border-brand-600 bg-brand-600 text-white'
            : 'border-gray-300 text-transparent hover:border-brand-400 dark:border-gray-600'
        }`}
      >
        <Check className={`h-3.5 w-3.5 ${completed ? 'animate-check-pop' : ''}`} strokeWidth={3} />
      </button>

      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium ${completed ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-gray-100'}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="mt-0.5 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">{task.description}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <Badge className={priorityColor(task.priority)}>{task.priority}</Badge>
          {category && (
            <Badge className="bg-gray-100 text-gray-600 dark:bg-ink-600 dark:text-gray-300">{category.name}</Badge>
          )}
          {dueLabel && (
            <span
              className={`inline-flex items-center gap-1 font-mono text-[11px] tabular-nums ${
                overdue ? 'font-semibold text-ember-600 dark:text-ember-400' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Clock className="h-3 w-3" />
              {dueLabel}
              {overdue && ' · Overdue'}
            </span>
          )}
          {durationLabel && (
            <span className="inline-flex items-center rounded-md bg-gray-50 px-1.5 py-0.5 font-mono text-[11px] tabular-nums text-gray-500 dark:bg-ink-600 dark:text-gray-400">
              {durationLabel}
            </span>
          )}
        </div>
      </div>

      <div className="relative shrink-0">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Task actions"
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-ink-600"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        {menuOpen && (
          <div
            className="absolute right-0 z-10 mt-1 w-32 overflow-hidden rounded-xl border border-gray-100 bg-paper-card shadow-card dark:border-ink-500 dark:bg-ink-600"
            onMouseLeave={() => setMenuOpen(false)}
          >
            <button
              onClick={() => {
                onEdit(task);
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-ink-500"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </button>
            <button
              onClick={() => {
                onDelete(task);
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-ember-600 hover:bg-ember-50 dark:text-ember-400 dark:hover:bg-ember-500/10"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
