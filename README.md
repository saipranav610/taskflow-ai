# TaskFlow AI

A full-stack, AI-powered task manager: React + TypeScript + Tailwind on the frontend, Supabase (Postgres + Auth + Row Level Security + Edge Functions) on the backend.

## Features

- Email/password auth (signup, login, logout, forgot/reset password), protected routes
- Tasks with title, description, category, priority, status, due date, estimated duration
- Dashboard: stat cards, completion progress, today's tasks, upcoming tasks
- Full task CRUD, filters (status/priority/category/search), sorting, calendar view
- AI Assistant: smart subtask breakdown, priority suggestions, "Plan My Day", productivity insights — all suggestion-only, user approves everything
- Light/dark mode with persistence, responsive layout (desktop/tablet/mobile)

## Architecture

```
React app (anon key only)
   → Supabase Postgres, protected entirely by Row Level Security
   → Supabase Edge Function "ai-assistant" (holds the AI_API_KEY server-side)
      → Anthropic API
      → validated JSON back to the frontend
```

The Supabase anon key is safe in the browser — every table it touches is locked down by the RLS policies in `supabase/schema.sql`, so a user can only ever read or write their own rows. The AI API key is **never** in frontend code; it lives only as a secret on the Edge Function.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New Project.
2. Pick a name, database password, and region. Wait for it to finish provisioning.

## 2. Get your Supabase URL and anon key

In your project: **Project Settings → API**.
- Copy **Project URL** → this is `VITE_SUPABASE_URL`.
- Copy the **anon / public** key → this is `VITE_SUPABASE_ANON_KEY`.

Never copy the **service_role** key into the frontend — it bypasses RLS entirely.

## 3. Create the tables and RLS policies

Go to **SQL Editor** in the Supabase dashboard, paste the entire contents of `supabase/schema.sql`, and run it. This creates:
- `profiles`, `categories`, `tasks` tables
- A trigger that auto-creates a profile and 5 default categories when a user signs up
- RLS policies so each user can only see/edit/delete their own rows

## 4. Configure authentication

In **Authentication → Providers**, email/password is enabled by default — no changes needed. Optionally, under **Authentication → URL Configuration**, set your site URL (e.g. `http://localhost:5173` for local dev) so password-reset emails link back correctly.

## 5. Deploy the AI Edge Function

You'll need the [Supabase CLI](https://supabase.com/docs/guides/cli) installed and logged in (`supabase login`).

```bash
supabase link --project-ref your-project-ref
supabase functions deploy ai-assistant
supabase secrets set AI_API_KEY=sk-ant-your-real-key
```

The function in `supabase/functions/ai-assistant/index.ts` verifies the caller's Supabase session before calling the AI model, and validates the AI's JSON response before returning it — the frontend never talks to the AI provider directly.

## 6. Configure environment variables

```bash
cp .env.example .env
```

Fill in:
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

(`AI_API_KEY` in `.env.example` is a reminder of what to set as a *Supabase secret* in step 5 — it is not read by the frontend build at all.)

## 7. Install and run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`, sign up, confirm your email (check the Supabase Auth email templates/logs in dev), and log in.

## 8. Build for production

```bash
npm run build
```

Deploy the `dist/` folder to any static host (Vercel, Netlify, Cloudflare Pages, etc.). No server is needed beyond Supabase itself.

## Project structure

```
src/
  components/
    ui/          Button, Card, Modal, form fields, Badge
    layout/      Sidebar, Header, AppShell, ProtectedRoute
    tasks/       TaskCard, TaskModal, TaskFilters
    dashboard/   StatsCards, ProgressSection, TodayTasks, UpcomingTasks
    ai/          PlanMyDay, ProductivityInsights
    calendar/    CalendarGrid
  pages/         Login, Signup, Dashboard, Tasks, Calendar, AIPlanner, Categories, Settings
  services/      taskService, categoryService, aiService (all Supabase/API calls)
  hooks/         useTasks, useCategories
  contexts/      AuthContext, ThemeContext
  types/         Shared TypeScript interfaces
  utils/         taskUtils (filtering, sorting, date helpers)
supabase/
  schema.sql              tables + RLS policies
  functions/ai-assistant/ Edge Function (holds the AI key)
```

## Notes on the AI features

- **Smart Breakdown**: suggests subtasks for a big task; you check which to keep, nothing is created until you save.
- **Priority Suggestion**: suggests a priority + one-line reason based on due date, duration, and workload; you can override it.
- **Plan My Day**: builds a suggested schedule from your incomplete tasks; nothing is scheduled or changed until you act on it.
- **Productivity Insights**: short, data-grounded observations from your own tasks — the Edge Function prompt explicitly instructs the model not to invent behavior it can't see in the data.
