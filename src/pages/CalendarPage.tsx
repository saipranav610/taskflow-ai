import { useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { CalendarGrid } from '../components/calendar/CalendarGrid';
import { TaskModal } from '../components/tasks/TaskModal';
import { Card } from '../components/ui/Card';
import { useTasks } from '../hooks/useTasks';
import { useCategories } from '../hooks/useCategories';
import { isOverdue } from '../utils/taskUtils';
import type { TaskInput } from '../types';

export default function CalendarPage() {
  const { tasks, createTask } = useTasks();
  const { categories } = useCategories();
  const [modalOpen, setModalOpen] = useState(false);
  const [prefilledDate, setPrefilledDate] = useState<string | null>(null);

  const overdueTasks = tasks.filter(isOverdue);

  return (
    <AppShell title="Calendar">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <Card className="p-5 lg:col-span-3">
          <CalendarGrid
            tasks={tasks}
            onDayClick={(date) => {
              setPrefilledDate(date);
              setModalOpen(true);
            }}
          />
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Overdue</h3>
          {overdueTasks.length === 0 ? (
            <p className="text-sm text-gray-400">Nothing overdue. Nice work.</p>
          ) : (
            <ul className="space-y-2">
              {overdueTasks.map((t) => (
                <li key={t.id} className="rounded-lg bg-red-50 dark:bg-red-500/10 p-2 text-sm text-red-700 dark:text-red-300">
                  {t.title} <span className="block text-xs text-red-500">{t.due_date}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <TaskModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setPrefilledDate(null);
        }}
        onSave={async (input: TaskInput) => {
          await createTask({ ...input, due_date: input.due_date ?? prefilledDate });
        }}
        categories={categories}
        initialTask={
          prefilledDate
            ? ({
                id: '',
                user_id: '',
                title: '',
                description: null,
                category_id: categories[0]?.id ?? null,
                priority: 'Medium',
                status: 'Todo',
                due_date: prefilledDate,
                estimated_duration: null,
                created_at: '',
                updated_at: '',
              } as any)
            : null
        }
        pendingTaskCount={tasks.filter((t) => t.status !== 'Completed').length}
      />
    </AppShell>
  );
}
