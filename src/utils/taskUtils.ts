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
      return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300';
    case 'High':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300';
    case 'Medium':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300';
    case 'Low':
      return 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-300';
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
