import { supabase } from '../lib/supabaseClient';
import type { Task, TaskInput } from '../types';

export const taskService = {
  async list(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('due_date', { ascending: true, nullsFirst: false });
    if (error) throw new Error(error.message);
    return data as Task[];
  },

  async create(userId: string, input: TaskInput): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert({ ...input, user_id: userId })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Task;
  },

  async update(taskId: string, input: Partial<TaskInput>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update(input)
      .eq('id', taskId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Task;
  },

  async setStatus(taskId: string, status: Task['status']): Promise<Task> {
    return this.update(taskId, { status });
  },

  async remove(taskId: string): Promise<void> {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (error) throw new Error(error.message);
  },
};
