import { useState } from 'react';
import { Plus } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { ConfirmDialog } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { useTasks } from '../hooks/useTasks';
import { useCategories } from '../hooks/useCategories';
import type { Task } from '../types';
import { filterTasks, sortTasks, type SortKey, type TaskFilters as TaskFiltersType } from '../utils/taskUtils';

export default function TasksPage() {
  const { tasks, loading, createTask, updateTask, deleteTask, setStatus } = useTasks();
  const { categories } = useCategories();
  const [filters, setFilters] = useState<TaskFiltersType>({ status: 'All', priority: 'All', categoryId: 'All' });
  const [sortKey, setSortKey] = useState<SortKey>('due_date');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const visibleTasks = sortTasks(filterTasks(tasks, filters), sortKey);

  async function handleToggleComplete(task: Task) {
    await setStatus(task.id, task.status === 'Completed' ? 'Todo' : 'Completed');
  }

  return (
    <AppShell title="My Tasks" onSearch={(v) => setFilters((f) => ({ ...f, search: v }))}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <TaskFilters filters={filters} onChange={setFilters} sortKey={sortKey} onSortChange={setSortKey} categories={categories} />
        <Button
          icon={<Plus className="h-4 w-4" />}
          onClick={() => {
            setEditingTask(null);
            setModalOpen(true);
          }}
        >
          New Task
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading tasks...</p>
      ) : visibleTasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 py-16 text-center">
          <p className="text-sm text-gray-400">No tasks match your filters yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {visibleTasks.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              category={categories.find((c) => c.id === t.category_id)}
              onToggleComplete={handleToggleComplete}
              onEdit={(task) => {
                setEditingTask(task);
                setModalOpen(true);
              }}
              onDelete={setTaskToDelete}
            />
          ))}
        </div>
      )}

      <TaskModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        onSave={async (input) => {
          if (editingTask) await updateTask(editingTask.id, input);
          else await createTask(input);
        }}
        categories={categories}
        initialTask={editingTask}
        pendingTaskCount={tasks.filter((t) => t.status !== 'Completed').length}
      />

      <ConfirmDialog
        open={!!taskToDelete}
        title="Delete task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This can't be undone.`}
        onCancel={() => setTaskToDelete(null)}
        onConfirm={async () => {
          if (taskToDelete) await deleteTask(taskToDelete.id);
          setTaskToDelete(null);
        }}
      />
    </AppShell>
  );
}
