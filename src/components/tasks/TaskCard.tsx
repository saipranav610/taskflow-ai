import { CheckCircle2, Circle, Clock, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Category, Task } from '../../types';
import { Badge } from '../ui/Badge';
import { isOverdue, priorityColor, statusColor } from '../../utils/taskUtils';

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

  return (
    <div
      className={`group flex items-start gap-3 rounded-xl border p-4 transition-theme ${
        overdue
          ? 'border-red-200 bg-red-50/50 dark:border-red-500/30 dark:bg-red-500/5'
          : 'border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900'
      }`}
    >
      <button
        onClick={() => onToggleComplete(task)}
        aria-label={completed ? 'Mark as not completed' : 'Mark as completed'}
        className="mt-0.5 shrink-0 text-brand-600 dark:text-brand-400"
      >
        {completed ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5 text-gray-300 dark:text-gray-600" />}
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
          <Badge className={statusColor(task.status)}>{task.status}</Badge>
          {category && (
            <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              {category.name}
            </Badge>
          )}
          {task.due_date && (
            <span className={`inline-flex items-center gap-1 text-xs ${overdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
              <Clock className="h-3 w-3" />
              {task.due_date}
              {overdue && ' · Overdue'}
            </span>
          )}
        </div>
      </div>

      <div className="relative shrink-0">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Task actions"
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        {menuOpen && (
          <div
            className="absolute right-0 z-10 mt-1 w-32 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-card dark:border-gray-800 dark:bg-gray-800"
            onMouseLeave={() => setMenuOpen(false)}
          >
            <button
              onClick={() => {
                onEdit(task);
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </button>
            <button
              onClick={() => {
                onDelete(task);
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
