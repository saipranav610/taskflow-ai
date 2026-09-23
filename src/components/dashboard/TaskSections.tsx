import type { Category, Task } from '../../types';
import { Card } from '../ui/Card';
import { TaskCard } from '../tasks/TaskCard';
import { isToday, isUpcoming } from '../../utils/taskUtils';

interface Props {
  tasks: Task[];
  categories: Category[];
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

function categoryFor(categories: Category[], id: string | null) {
  return categories.find((c) => c.id === id);
}

export function TodayTasks({ tasks, categories, onToggleComplete, onEdit, onDelete }: Props) {
  const todayTasks = tasks.filter((t) => isToday(t.due_date));
  return (
    <Card className="p-5">
      <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Today's Tasks</h3>
      {todayTasks.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-400">Nothing due today. Enjoy the breathing room.</p>
      ) : (
        <div className="space-y-2">
          {todayTasks.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              category={categoryFor(categories, t.category_id)}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

export function UpcomingTasks({ tasks, categories, onToggleComplete, onEdit, onDelete }: Props) {
  const upcoming = tasks.filter(isUpcoming).slice(0, 6);
  return (
    <Card className="p-5">
      <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Upcoming Tasks</h3>
      {upcoming.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-400">No upcoming tasks scheduled.</p>
      ) : (
        <div className="space-y-2">
          {upcoming.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              category={categoryFor(categories, t.category_id)}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
