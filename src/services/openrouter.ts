const API_URL = '/api/openrouter/chat/completions';
const MODEL = 'deepseek/deepseek-v4-flash';
const TIMEOUT_MS = 30_000;

const SYSTEM_PROMPT = `You are Nasseg's AI fashion stylist assistant. You help customers with fashion advice, product recommendations, sizing, and store information.

Rules:
- Match the user's language: if they write in English, reply in English. If they write in Arabic, reply in Arabic. Never mix both.
- Keep replies concise: 2-5 sentences, but be informative and helpful
- Only answer questions about Nasseg fashion store (products, styling, sizing, returns, shipping, collections, trends, outfit pairing)
- If asked about anything else, politely redirect to fashion topics
- Use a friendly, luxury boutique tone
- You may use light markdown: **bold** for emphasis, * for italic, and simple lists with "-" for clarity
- Never reveal that you are an AI model or mention technical details about the underlying system`;

const cache = new Map<string, { content: string; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000;

export type AIResult = {
  content: string;
  error: boolean;
};

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
  onStream?: (chunk: string) => void,
  externalSignal?: AbortSignal
): Promise<AIResult> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    return {
      content: "API key not configured. Please add your OpenRouter API key to the .env file as VITE_OPENROUTER_API_KEY.",
      error: true,
    };
  }

  const cached = getCached(messages);
  if (cached) return { content: cached, error: false };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  if (externalSignal) {
    if (externalSignal.aborted) {
      clearTimeout(timeout);
      return { content: "Generation stopped.", error: false };
    }
    externalSignal.addEventListener('abort', () => controller.abort(), { once: true });
  }

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
        max_tokens: 500,
        temperature: 0.7,
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
      let detail = '';
      try {
        const errBody = await res.json();
        detail = errBody?.error?.message || errBody?.detail || '';
      } catch { /* ignore */ }

      if (res.status === 401) {
        return { content: "Invalid API key. Please check your OpenRouter API key in the .env file and make sure it has credits.", error: true };
      }
      if (res.status === 404) {
        return { content: `Model "${MODEL}" not found on OpenRouter. It may have been renamed. Please check the model name.`, error: true };
      }
      if (res.status === 429) {
        return { content: "Too many requests. Please wait a few seconds and try again.", error: true };
      }
      if (res.status >= 500) {
        return { content: "AI service is temporarily unavailable. Please try again in a moment.", error: true };
      }
      return { content: detail || `Request failed with status ${res.status}. Please try again.`, error: true };
    }

    if (onStream && res.body) {
      return streamResponse(res, onStream, messages, externalSignal);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return { content: "The AI returned an empty response. Please try rephrasing your question.", error: true };
    }
    setCache(messages, content);
    return { content, error: false };
  } catch (err) {
    clearTimeout(timeout);
    const isAbort = err instanceof DOMException && err.name === 'AbortError';
    if (isAbort) {
      return { content: "Request timed out. Please try again.", error: true };
    }
    return {
      content: "Could not connect to the AI service. Please check your internet connection and try again.",
      error: true,
    };
  }
}

async function streamResponse(
  res: Response,
  onStream: (chunk: string) => void,
  messages: { role: string; content: string }[],
  externalSignal?: AbortSignal
): Promise<AIResult> {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let fullContent = '';
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      if (externalSignal?.aborted) {
        try { reader.cancel(); } catch { /* ignore */ }
        return { content: fullContent || "Generation stopped.", error: false };
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const json = line.slice(6).trim();
        if (json === '[DONE]') continue;
        try {
          const parsed = JSON.parse(json);

          if (parsed.error) {
            const errMsg = parsed.error.message || 'Unknown API error';
            return { content: fullContent || `API error: ${errMsg}`, error: true };
          }

          const delta = parsed.choices?.[0]?.delta?.content || '';
          if (delta) {
            fullContent += delta;
            onStream(delta);
          }
        } catch { /* skip malformed chunk */ }
      }
    }
  } catch (err) {
    const isAbort = err instanceof DOMException && err.name === 'AbortError';
    if (isAbort) {
      return { content: fullContent || "Generation stopped.", error: false };
    }
    return {
      content: fullContent || "Connection lost while reading response. Please try again.",
      error: true,
    };
  }

  if (fullContent) setCache(messages, fullContent);
  return {
    content: fullContent || "The AI returned an empty response. Please try rephrasing your question.",
    error: !fullContent,
  };
}
