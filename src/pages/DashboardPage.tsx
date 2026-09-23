import { useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { StatsCards } from '../components/dashboard/StatsCards';
import { ProgressSection } from '../components/dashboard/ProgressSection';
import { TodayTasks, UpcomingTasks } from '../components/dashboard/TaskSections';
import { TaskModal } from '../components/tasks/TaskModal';
import { ConfirmDialog } from '../components/ui/Modal';
import { useTasks } from '../hooks/useTasks';
import { useCategories } from '../hooks/useCategories';
import type { Task } from '../types';

export default function DashboardPage() {
  const { tasks, loading, error, createTask, updateTask, deleteTask, setStatus } = useTasks();
  const { categories } = useCategories();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  function handleEdit(task: Task) {
    setEditingTask(task);
    setModalOpen(true);
  }

  async function handleToggleComplete(task: Task) {
    await setStatus(task.id, task.status === 'Completed' ? 'Todo' : 'Completed');
  }

  return (
    <AppShell title="Dashboard">
      {loading ? (
        <p className="text-sm text-gray-400">Loading your tasks...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <div className="space-y-6">
          <StatsCards tasks={tasks} />
          <ProgressSection tasks={tasks} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <TodayTasks
              tasks={tasks}
              categories={categories}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEdit}
              onDelete={setTaskToDelete}
            />
            <UpcomingTasks
              tasks={tasks}
              categories={categories}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEdit}
              onDelete={setTaskToDelete}
            />
          </div>
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
