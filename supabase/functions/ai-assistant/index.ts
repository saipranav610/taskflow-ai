// Supabase Edge Function: ai-assistant
// Deploy with: supabase functions deploy ai-assistant
//
// Gemini API key is stored securely as a Supabase Edge Function secret:
// GEMINI_API_KEY
//
// The frontend never receives the Gemini API key.
// The function verifies the logged-in Supabase user before making
// an AI request.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify that the caller is logged in.
    const authHeader = req.headers.get('Authorization');

    if (!authHeader) {
      return jsonError('Not authenticated.', 401);
    }

    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError || !userData.user) {
      return jsonError('Not authenticated.', 401);
    }

    // Read request body.
    const body = await req.json();
    const { action } = body;

    let prompt: string;

    switch (action) {
      case 'breakdown':
        prompt = breakdownPrompt(
          body.title,
          body.description
        );
        break;

      case 'priority':
        prompt = priorityPrompt(body);
        break;

      case 'plan-day':
        prompt = planDayPrompt(body.tasks);
        break;

      case 'insights':
        prompt = insightsPrompt(body.tasks);
        break;

      default:
        return jsonError('Unknown action.', 400);
    }

    // Call Gemini.
    const aiText = await callGemini(prompt);

    // Convert Gemini response into JSON.
    const parsed = safeParseJSON(aiText);

    if (!parsed) {
      return jsonError(
        'The AI returned an invalid response.',
        502
      );
    }

    // Validate the AI response.
    const validated = validate(action, parsed);

    if (!validated) {
      return jsonError(
        'The AI response failed validation.',
        502
      );
    }

    return new Response(
      JSON.stringify(validated),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    console.error('ai-assistant error:', err);

    return jsonError(
      'Internal error. Please try again.',
      500
    );
  }
});

// ---------- Gemini API ----------

async function callGemini(
  prompt: string
): Promise<string> {
  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent',
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },

      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text:
                'You are a task-planning assistant. Respond ONLY with valid JSON matching the requested shape. No prose, no markdown fences.',
            },
          ],
        },

        contents: [
          {
            role: 'user',
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],

        generationConfig: {
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Gemini API error: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();

  const text =
    data.candidates?.[0]?.content?.parts
      ?.map(
        (part: { text?: string }) =>
          part.text ?? ''
      )
      .join('') ?? '';

  return text;
}

// ---------- JSON Parsing ----------

function safeParseJSON(
  text: string
): unknown | null {
  try {
    const cleaned = text
      .replace(/```json|```/g, '')
      .trim();

    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

// ---------- Prompts ----------

function breakdownPrompt(
  title: string,
  description?: string
): string {
  return `
Break the following task into 3-6 concrete,
actionable subtasks with a realistic
estimated_duration in minutes for each.

Task title: "${title}"

Task description: "${description ?? ''}"

Respond with JSON exactly like:

{
  "subtasks": [
    {
      "title": "string",
      "estimated_duration": number
    }
  ]
}
`;
}

function priorityPrompt(body: {
  title: string;
  description?: string;
  due_date?: string;
  estimated_duration?: number;
  pending_task_count?: number;
}): string {
  return `
Suggest a priority for this task.

The priority must be exactly one of:

Low
Medium
High
Urgent

Also provide a one-sentence reason.

Title: "${body.title}"

Description: "${body.description ?? ''}"

Due date: ${body.due_date ?? 'none'}

Estimated duration in minutes:
${body.estimated_duration ?? 'unknown'}

Number of other pending tasks:
${body.pending_task_count ?? 0}

Respond with JSON exactly like:

{
  "suggested_priority": "High",
  "reason": "string"
}
`;
}

function planDayPrompt(
  tasks: unknown[]
): string {
  return `
Given these incomplete tasks, create a
suggested daily plan with clock times.

Include short breaks.

Only use the tasks provided.
Do not invent new tasks.

Tasks:

${JSON.stringify(tasks)}

Respond with JSON exactly like:

{
  "plan": [
    {
      "time": "9:00 AM",
      "task_title": "string",
      "task_id": "string or omit for breaks",
      "duration_minutes": number,
      "is_break": boolean
    }
  ]
}
`;
}

function insightsPrompt(
  tasks: unknown[]
): string {
  return `
Given this task history/data, generate
2-4 short productivity insights.

Base every insight only on patterns
actually present in the data.

Do not invent behavior that cannot
be seen in the data.

Tasks:

${JSON.stringify(tasks)}

Respond with JSON exactly like:

{
  "insights": [
    "string",
    "string"
  ]
}
`;
}

// ---------- Validation ----------

function validate(
  action: string,
  data: any
): unknown | null {
  switch (action) {

    case 'breakdown':
      if (!Array.isArray(data.subtasks)) {
        return null;
      }

      return {
        subtasks: data.subtasks
          .filter(
            (s: any) =>
              typeof s.title === 'string'
          )
          .map((s: any) => ({
            title: s.title,
            estimated_duration:
              Number(
                s.estimated_duration
              ) || 30,
          })),
      };

    case 'priority': {
      const valid = [
        'Low',
        'Medium',
        'High',
        'Urgent',
      ];

      if (
        !valid.includes(
          data.suggested_priority
        )
      ) {
        return null;
      }

      return {
        suggested_priority:
          data.suggested_priority,

        reason: String(
          data.reason ?? ''
        ),
      };
    }

    case 'plan-day':
      if (!Array.isArray(data.plan)) {
        return null;
      }

      return {
        plan: data.plan,
      };

    case 'insights':
      if (!Array.isArray(data.insights)) {
        return null;
      }

      return {
        insights: data.insights.map(
          (i: unknown) => String(i)
        ),
      };

    default:
      return null;
  }
}

// ---------- Error Response ----------

function jsonError(
  message: string,
  status: number
): Response {
  return new Response(
    JSON.stringify({
      error: message,
    }),
    {
      status,
      headers: {
        ...corsHeaders,
        'Content-Type':
          'application/json',
      },
    }
  );
}