const API_URL = '/api/openrouter/chat/completions';
const MODEL = 'poolside/laguna-m.1:free';
const TIMEOUT_MS = 15_000;

const SYSTEM_PROMPT = `You are Nasseg's AI fashion stylist assistant. You help customers with fashion advice, product recommendations, sizing, and store information.

Rules:
- Match the user's language: if they write in English, reply in English. If they write in Arabic, reply in Arabic. Never mix both.
- Keep replies very short: 1-3 sentences max
- Only answer questions about Nasseg fashion store (products, styling, sizing, returns, shipping, collections)
- If asked about anything else, politely redirect to fashion topics
- Use a friendly, luxury boutique tone`;

const cache = new Map<string, { content: string; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function getCacheKey(messages: { role: string; content: string }[]): string {
  return JSON.stringify(messages);
}

function getCached(messages: { role: string; content: string }[]): string | null {
  const key = getCacheKey(messages);
  const entry = cache.get(key);
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.content;
  cache.delete(key);
  return null;
}

function setCache(messages: { role: string; content: string }[], content: string): void {
  const key = getCacheKey(messages);
  cache.set(key, { content, ts: Date.now() });
}

export async function getAIResponse(
  messages: { role: string; content: string }[],
  onStream?: (chunk: string) => void
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    return "Please set your OpenRouter API key in the .env file (VITE_OPENROUTER_API_KEY).";
  }

  const cached = getCached(messages);
  if (cached) return cached;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'NASSEG Fashion',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 100,
        temperature: 0,
        stream: !!onStream,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return "Sorry, I'm having trouble connecting right now. Please try again later.";
    }

    if (onStream && res.body) {
      return streamResponse(res, onStream, messages);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";
    setCache(messages, content);
    return content;
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof DOMException && err.name === 'AbortError') {
      return "Request timed out. Please try again.";
    }
    return "Sorry, something went wrong. Please try again.";
  }
}

async function streamResponse(
  res: Response,
  onStream: (chunk: string) => void,
  messages: { role: string; content: string }[]
): Promise<string> {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let fullContent = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const json = line.slice(6).trim();
      if (json === '[DONE]') continue;
      try {
        const parsed = JSON.parse(json);
        const delta = parsed.choices?.[0]?.delta?.content || '';
        if (delta) {
          fullContent += delta;
          onStream(delta);
        }
      } catch { /* skip malformed chunk */ }
    }
  }

  if (fullContent) setCache(messages, fullContent);
  return fullContent || "I couldn't generate a response. Please try again.";
}
