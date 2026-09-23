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
  return (
    <div className="flex flex-wrap gap-2">
      <Select
        value={filters.status ?? 'All'}
        onChange={(e) => onChange({ ...filters, status: e.target.value as TaskStatus | 'All' })}
        className="w-auto"
        aria-label="Filter by status"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s === 'All' ? 'All statuses' : s}
          </option>
        ))}
      </Select>

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
  );
}
