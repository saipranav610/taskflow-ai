import { FormEvent, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/FormField';
import { ConfirmDialog } from '../components/ui/Modal';
import { useCategories } from '../hooks/useCategories';
import type { Category } from '../types';

const SWATCHES = ['#6f42f5', '#2563eb', '#059669', '#dc2626', '#d97706', '#0891b2', '#db2777', '#6b7280'];

export default function CategoriesPage() {
  const { categories, createCategory, deleteCategory, loading } = useCategories();
  const [name, setName] = useState('');
  const [color, setColor] = useState(SWATCHES[0]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Category | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await createCategory(name.trim(), color);
      setName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create category.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell title="Categories">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Your categories</h3>
          {loading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : (
            <ul className="space-y-2">
              {categories.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 dark:border-gray-800 px-3 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-sm text-gray-800 dark:text-gray-200">{c.name}</span>
                    {c.is_default && <span className="text-xs text-gray-400">(default)</span>}
                  </div>
                  {!c.is_default && (
                    <button
                      onClick={() => setToDelete(c)}
                      aria-label={`Delete ${c.name}`}
                      className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">New category</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label htmlFor="catName">Name</Label>
              <Input id="catName" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Finance" />
            </div>
            <div>
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {SWATCHES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setColor(s)}
                    aria-label={`Choose color ${s}`}
                    className={`h-7 w-7 rounded-full ${color === s ? 'ring-2 ring-offset-2 ring-brand-500 dark:ring-offset-gray-900' : ''}`}
                    style={{ backgroundColor: s }}
                  />
                ))}
              </div>
            </div>
            {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
            <Button type="submit" className="w-full" icon={<Plus className="h-4 w-4" />} loading={saving}>
              Add category
            </Button>
          </form>
        </Card>
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete category"
        message={`Delete "${toDelete?.name}"? Tasks in this category will become uncategorized.`}
        onCancel={() => setToDelete(null)}
        onConfirm={async () => {
          if (toDelete) await deleteCategory(toDelete.id);
          setToDelete(null);
        }}
      />
    </AppShell>
  );
}
