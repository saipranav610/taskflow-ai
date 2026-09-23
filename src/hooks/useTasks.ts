import { useCallback, useEffect, useState } from 'react';
import { taskService } from '../services/taskService';
import type { Task, TaskInput } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.list(user.id);
      setTasks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function createTask(input: TaskInput) {
    if (!user) return;
    const task = await taskService.create(user.id, input);
    setTasks((prev) => [...prev, task]);
    return task;
  }

  async function updateTask(id: string, input: Partial<TaskInput>) {
    const updated = await taskService.update(id, input);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }

  async function deleteTask(id: string) {
    await taskService.remove(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  async function setStatus(id: string, status: Task['status']) {
    const updated = await taskService.setStatus(id, status);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  return { tasks, loading, error, refresh, createTask, updateTask, deleteTask, setStatus };
}
