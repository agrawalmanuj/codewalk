const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

const SYSTEM_PROMPT = `You are a code walkthrough generator. Given a code snippet, break it into a sequence of small logical steps suitable for an animated visualization (like a whiteboard walkthrough).

Respond with ONLY valid JSON (no markdown fences, no commentary) matching this exact shape:

{
  "language": "<detected language>",
  "summary": "<one sentence summary of what the code does>",
  "steps": [
    {
      "id": 1,
      "line": <1-indexed line number in the original snippet this step corresponds to, or null>,
      "title": "<short step title, 3-6 words>",
      "description": "<one or two sentences explaining what happens in this step, written for a beginner>",
      "variables": [
        { "name": "<var name>", "value": "<current value as a short string>", "action": "create" | "update" | "read" }
      ],
      "flow": [
        { "from": "<variable or step name>", "to": "<variable or step name>", "label": "<short label, e.g. 'passed to', 'returns'>" }
      ]
    }
  ]
}

Rules:
- Break the code into 4-12 steps depending on complexity. Prefer more, smaller steps over few large ones.
- "variables" should only include variables that are created, updated, or meaningfully read in that step.
- "flow" should only include entries when data visibly moves between named variables/functions in that step; omit the field or use an empty array otherwise.
- Keep "value" short (truncate long strings/arrays with "...").
- Every step must reference a real line from the snippet when possible.
- Do not wrap the JSON in markdown code fences.`

function extractJson(text) {
  const trimmed = text.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  const candidate = fenced ? fenced[1] : trimmed
  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')
  if (start === -1 || end === -1) {
    throw new Error('Could not find JSON object in model response')
  }
  return JSON.parse(candidate.slice(start, end + 1))
}

export async function explainCode(code) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey) {
    throw new Error('Missing VITE_GROQ_API_KEY — add it to your .env.local file')
  }

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: code },
      ],
      temperature: 0.3,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Groq API error (${res.status}): ${body}`)
  }

  const data = await res.json()
  const content = data.choices[0].message.content
  const parsed = extractJson(content)

  if (!Array.isArray(parsed.steps) || parsed.steps.length === 0) {
    throw new Error('Model response did not include any steps')
  }

  return parsed
}
