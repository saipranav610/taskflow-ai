import { FormEvent, useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { Category, Priority, Task, TaskInput, TaskStatus } from '../../types';
import { Modal } from '../ui/Modal';
import { Label, Input, Textarea, Select, FieldError } from '../ui/FormField';
import { Button } from '../ui/Button';
import { aiService } from '../../services/aiService';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (input: TaskInput) => Promise<void>;
  categories: Category[];
  initialTask?: Task | null;
  pendingTaskCount: number;
}

const PRIORITIES: Priority[] = ['Low', 'Medium', 'High', 'Urgent'];
const STATUSES: TaskStatus[] = ['Todo', 'In Progress', 'Completed'];

export function TaskModal({ open, onClose, onSave, categories, initialTask, pendingTaskCount }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [status, setStatus] = useState<TaskStatus>('Todo');
  const [dueDate, setDueDate] = useState('');
  const [duration, setDuration] = useState('');
  const [titleError, setTitleError] = useState('');
  const [saving, setSaving] = useState(false);

  const [aiSubtasks, setAiSubtasks] = useState<{ title: string; estimated_duration: number; accepted: boolean }[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [prioritySuggestion, setPrioritySuggestion] = useState<{ suggested_priority: Priority; reason: string } | null>(null);
  const [priorityLoading, setPriorityLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(initialTask?.title ?? '');
      setDescription(initialTask?.description ?? '');
      setCategoryId(initialTask?.category_id ?? categories[0]?.id ?? '');
      setPriority(initialTask?.priority ?? 'Medium');
      setStatus(initialTask?.status ?? 'Todo');
      setDueDate(initialTask?.due_date ?? '');
      setDuration(initialTask?.estimated_duration ? String(initialTask.estimated_duration) : '');
      setTitleError('');
      setAiSubtasks([]);
      setPrioritySuggestion(null);
      setAiError('');
    }
  }, [open, initialTask, categories]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError('Title is required.');
      return;
    }
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        category_id: categoryId || null,
        priority,
        status,
        due_date: dueDate || null,
        estimated_duration: duration ? Number(duration) : null,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  async function handleBreakdown() {
    if (!title.trim()) {
      setTitleError('Enter a title first.');
      return;
    }
    setAiError('');
    setAiLoading(true);
    try {
      const res = await aiService.breakdownTask(title, description);
      setAiSubtasks(res.subtasks.map((s) => ({ ...s, accepted: true })));
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'AI breakdown failed.');
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSuggestPriority() {
    if (!title.trim()) {
      setTitleError('Enter a title first.');
      return;
    }
    setAiError('');
    setPriorityLoading(true);
    try {
      const res = await aiService.suggestPriority(
        title,
        description,
        dueDate || undefined,
        duration ? Number(duration) : undefined,
        pendingTaskCount
      );
      setPrioritySuggestion(res);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'AI priority suggestion failed.');
    } finally {
      setPriorityLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={initialTask ? 'Edit Task' : 'Create Task'} maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (titleError) setTitleError('');
            }}
            placeholder="e.g. Prepare for database examination"
          />
          <FieldError message={titleError} />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more detail (optional)"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select id="status" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="due_date">Due date</Label>
            <Input id="due_date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="duration">Estimated duration (min)</Label>
            <Input
              id="duration"
              type="number"
              min={0}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="60"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="priority">Priority</Label>
            <button
              type="button"
              onClick={handleSuggestPriority}
              disabled={priorityLoading}
              className="mb-1.5 flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 disabled:opacity-50 dark:text-brand-400"
            >
              <Sparkles className="h-3 w-3" />
              {priorityLoading ? 'Thinking...' : 'Suggest with AI'}
            </button>
          </div>
          <Select id="priority" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
          {prioritySuggestion && (
            <div className="mt-2 rounded-lg bg-brand-50 dark:bg-brand-500/10 p-3 text-xs text-brand-800 dark:text-brand-300">
              <p>
                Suggested: <strong>{prioritySuggestion.suggested_priority}</strong> — {prioritySuggestion.reason}
              </p>
              <button
                type="button"
                onClick={() => setPriority(prioritySuggestion.suggested_priority)}
                className="mt-1 font-semibold underline"
              >
                Use this priority
              </button>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-dashed border-gray-200 dark:border-gray-700 p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">AI Smart Breakdown</p>
            <button
              type="button"
              onClick={handleBreakdown}
              disabled={aiLoading}
              className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 disabled:opacity-50 dark:text-brand-400"
            >
              <Sparkles className="h-3 w-3" />
              {aiLoading ? 'Breaking it down...' : 'Suggest subtasks'}
            </button>
          </div>
          {aiSubtasks.length > 0 && (
            <ul className="mt-2 space-y-1.5">
              {aiSubtasks.map((s, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={s.accepted}
                    onChange={() =>
                      setAiSubtasks((prev) =>
                        prev.map((item, idx) => (idx === i ? { ...item, accepted: !item.accepted } : item))
                      )
                    }
                    className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className={s.accepted ? '' : 'line-through text-gray-400'}>
                    {s.title} <span className="text-xs text-gray-400">({s.estimated_duration}m)</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-1 text-xs text-gray-400">
            Subtasks are suggestions only — save this task, then create the accepted ones yourself.
          </p>
        </div>

        {aiError && <p className="text-xs text-red-600 dark:text-red-400">{aiError}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {initialTask ? 'Save changes' : 'Create task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
