import type { Category, Priority, TaskStatus } from '../../types';
import type { SortKey, TaskFilters as TaskFiltersType } from '../../utils/taskUtils';
import { Select } from '../ui/FormField';

interface Props {
  filters: TaskFiltersType;
  onChange: (filters: TaskFiltersType) => void;
  sortKey: SortKey;
  onSortChange: (key: SortKey) => void;
  categories: Category[];
}

const STATUSES: (TaskStatus | 'All')[] = ['All', 'Todo', 'In Progress', 'Completed'];
const PRIORITIES: (Priority | 'All')[] = ['All', 'Low', 'Medium', 'High', 'Urgent'];

export function TaskFilters({ filters, onChange, sortKey, onSortChange, categories }: Props) {
  const status = filters.status ?? 'All';

  return (
    <div className="flex flex-col gap-2.5">
      {/* Segmented status control — the filter people reach for most, so it
          gets a one-tap pill row instead of being buried in a dropdown. */}
      <div className="flex w-full gap-1 overflow-x-auto rounded-xl bg-gray-100 p-1 dark:bg-ink-600 sm:w-fit">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => onChange({ ...filters, status: s })}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-theme ${
              status === s
                ? 'bg-white text-gray-900 shadow-soft dark:bg-ink-500 dark:text-gray-100'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {s === 'All' ? 'All' : s}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Select
          value={filters.priority ?? 'All'}
          onChange={(e) => onChange({ ...filters, priority: e.target.value as Priority | 'All' })}
          className="w-auto"
          aria-label="Filter by priority"
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p === 'All' ? 'All priorities' : p}
            </option>
          ))}
        </Select>

        <Select
          value={filters.categoryId ?? 'All'}
          onChange={(e) => onChange({ ...filters, categoryId: e.target.value })}
          className="w-auto"
          aria-label="Filter by category"
        >
          <option value="All">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>

        <Select
          value={sortKey}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          className="w-auto"
          aria-label="Sort tasks"
        >
          <option value="due_date">Sort: Due date</option>
          <option value="priority">Sort: Priority</option>
          <option value="created_at">Sort: Newest</option>
          <option value="title">Sort: Alphabetical</option>
        </Select>
      </div>
    </div>
  );
}
