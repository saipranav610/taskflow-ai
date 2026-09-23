import { useCallback, useEffect, useState } from 'react';
import { categoryService } from '../services/categoryService';
import type { Category } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function useCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      setCategories(await categoryService.list(user.id));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function createCategory(name: string, color: string) {
    if (!user) return;
    const cat = await categoryService.create(user.id, name, color);
    setCategories((prev) => [...prev, cat]);
    return cat;
  }

  async function deleteCategory(id: string) {
    await categoryService.remove(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return { categories, loading, refresh, createCategory, deleteCategory };
}
