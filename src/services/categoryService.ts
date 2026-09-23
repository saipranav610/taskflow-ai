import { supabase } from '../lib/supabaseClient';
import type { Category } from '../types';

export const categoryService = {
  async list(userId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('name', { ascending: true });
    if (error) throw new Error(error.message);
    return data as Category[];
  },

  async create(userId: string, name: string, color: string): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert({ user_id: userId, name, color, is_default: false })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Category;
  },

  async remove(categoryId: string): Promise<void> {
    const { error } = await supabase.from('categories').delete().eq('id', categoryId);
    if (error) throw new Error(error.message);
  },
};
