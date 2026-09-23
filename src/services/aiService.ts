import { supabase } from '../lib/supabaseClient';
import type {
  AIBreakdownResponse,
  AIPlanResponse,
  AIPrioritySuggestion,
  AIInsightsResponse,
  Task,
} from '../types';

// Every call is routed through the "ai-assistant" Supabase Edge Function.
// The function verifies the caller's session and holds the AI_API_KEY
// server-side — it is never present in this file or in the browser bundle.
async function invokeAI<T>(action: string, payload: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke('ai-assistant', {
    body: { action, ...payload },
  });
  if (error) throw new Error('AI request failed. Please try again in a moment.');
  if (!data || data.error) throw new Error(data?.error ?? 'The AI service returned an invalid response.');
  return data as T;
}

export const aiService = {
  async breakdownTask(title: string, description?: string): Promise<AIBreakdownResponse> {
    return invokeAI<AIBreakdownResponse>('breakdown', { title, description });
  },

  async suggestPriority(
    title: string,
    description: string | undefined,
    dueDate: string | undefined,
    estimatedDuration: number | undefined,
    pendingTaskCount: number
  ): Promise<AIPrioritySuggestion> {
    return invokeAI<AIPrioritySuggestion>('priority', {
      title,
      description,
      due_date: dueDate,
      estimated_duration: estimatedDuration,
      pending_task_count: pendingTaskCount,
    });
  },

  async planMyDay(tasks: Task[]): Promise<AIPlanResponse> {
    const incomplete = tasks.filter((t) => t.status !== 'Completed');
    return invokeAI<AIPlanResponse>('plan-day', { tasks: incomplete });
  },

  async getInsights(tasks: Task[]): Promise<AIInsightsResponse> {
    return invokeAI<AIInsightsResponse>('insights', { tasks });
  },
};
