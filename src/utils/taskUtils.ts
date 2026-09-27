import type { Task, Priority, TaskStatus } from '../types';

export function isToday(dateStr: string | null): boolean {
  if (!dateStr) return false;
  return dateStr === new Date().toISOString().slice(0, 10);
}

export function isOverdue(task: Task): boolean {
  if (!task.due_date || task.status === 'Completed') return false;
  return task.due_date < new Date().toISOString().slice(0, 10);
}

export function isUpcoming(task: Task): boolean {
  if (!task.due_date || task.status === 'Completed') return false;
  const today = new Date().toISOString().slice(0, 10);
  return task.due_date > today;
}

const PRIORITY_ORDER: Record<Priority, number> = { Urgent: 0, High: 1, Medium: 2, Low: 3 };

export type SortKey = 'due_date' | 'priority' | 'created_at' | 'title';

export function sortTasks(tasks: Task[], key: SortKey): Task[] {
  const copy = [...tasks];
  switch (key) {
    case 'due_date':
      return copy.sort((a, b) => (a.due_date ?? '9999').localeCompare(b.due_date ?? '9999'));
    case 'priority':
      return copy.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    case 'created_at':
      return copy.sort((a, b) => b.created_at.localeCompare(a.created_at));
    case 'title':
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return copy;
  }
}

export interface TaskFilters {
  status?: TaskStatus | 'All';
  priority?: Priority | 'All';
  categoryId?: string | 'All';
  search?: string;
}

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  return tasks.filter((t) => {
    if (filters.status && filters.status !== 'All' && t.status !== filters.status) return false;
    if (filters.priority && filters.priority !== 'All' && t.priority !== filters.priority) return false;
    if (filters.categoryId && filters.categoryId !== 'All' && t.category_id !== filters.categoryId)
      return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const inTitle = t.title.toLowerCase().includes(q);
      const inDesc = (t.description ?? '').toLowerCase().includes(q);
      if (!inTitle && !inDesc) return false;
    }
    return true;
  });
}

export function priorityColor(priority: Priority): string {
  switch (priority) {
    case 'Urgent':
      return 'bg-ember-100 text-ember-700 dark:bg-ember-500/20 dark:text-ember-300';
    case 'High':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300';
    case 'Medium':
      return 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300';
    case 'Low':
      return 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-300';
  }
}

// The accent bar color on a task card — the priority's primary signal,
// so the badge itself can stay quieter.
export function priorityAccent(priority: Priority): string {
  switch (priority) {
    case 'Urgent':
      return 'bg-ember-500';
    case 'High':
      return 'bg-amber-400';
    case 'Medium':
      return 'bg-sky-400';
    case 'Low':
      return 'bg-gray-300 dark:bg-gray-600';
  }
}

export function statusColor(status: TaskStatus): string {
  switch (status) {
    case 'Completed':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300';
    case 'In Progress':
      return 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300';
    case 'Todo':
      return 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-300';
  }
}

// "90" -> "1h 30m" for the duration chip.
export function formatDuration(minutes: number | null): string | null {
  if (!minutes || minutes <= 0) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// A short, human due-date label: Today / Tomorrow / Mon 14 / date, so the
// same field reads at a glance instead of as a raw ISO string.
export function formatDueDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  if (dateStr === today) return 'Today';
  if (dateStr === tomorrow) return 'Tomorrow';
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
}
