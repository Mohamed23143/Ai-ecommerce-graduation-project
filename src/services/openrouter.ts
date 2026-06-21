const API_URL = '/api/openrouter/chat/completions';
const MODEL = "deepseek/deepseek-v4-flash";
const TIMEOUT_MS = 20_000;

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
    console.error('[OpenRouter] No API key found in VITE_OPENROUTER_API_KEY');
    return "Please set your OpenRouter API key in the .env file (VITE_OPENROUTER_API_KEY).";
  }

  console.log('[OpenRouter] API key present (first 10 chars):', apiKey.substring(0, 10) + '...');
  console.log('[OpenRouter] Messages being sent:', JSON.stringify(messages));

  const cached = getCached(messages);
  if (cached) {
    console.log('[OpenRouter] Returning cached response');
    return cached;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const payload = {
      model: MODEL,
      max_tokens: 100,
      temperature: 0,
      stream: !!onStream,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
    };
    console.log('[OpenRouter] Sending payload model:', MODEL, 'stream:', !!onStream);

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'NASSEG Fashion',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    console.log('[OpenRouter] Response status:', res.status, res.statusText);
    console.log('[OpenRouter] Response body stream available:', !!res.body);

    if (!res.ok) {
      console.error('[OpenRouter] Request failed');
      console.error('[OpenRouter] Status:', res.status, res.statusText);
      console.error('[OpenRouter] Model requested:', MODEL);
      console.error('[OpenRouter] API key (first 10 chars):', apiKey.substring(0, 10) + '...');
      try {
        const errBody = await res.json();
        console.error('[OpenRouter] Error body:', JSON.stringify(errBody, null, 2));
      } catch {
        const errText = await res.text().catch(() => '');
        console.error('[OpenRouter] Raw error text:', errText);
      }
      return "Sorry, I'm having trouble connecting right now. Please try again later.";
    }

    if (onStream && res.body) {
      console.log('[OpenRouter] Streaming path selected');
      const result = await streamResponse(res, onStream, messages);
      console.log('[OpenRouter] Stream complete, final content length:', result.length);
      return result;
    }

    console.log('[OpenRouter] JSON (non-streaming) path — res.body was', !!res.body ? 'available' : 'null', 'onStream was', !!onStream);
    const rawText = await res.text();
    console.log('[OpenRouter] RAW response text:', rawText);
    const data = JSON.parse(rawText);
    console.log('[OpenRouter] Parsed JSON:', JSON.stringify(data, null, 2));
    const content = data.choices?.[0]?.message?.content;
    console.log('[OpenRouter] EXTRACTED text:', content);
    if (content) {
      setCache(messages, content);
      return content;
    }
    return "I couldn't generate a response. Please try again.";
  } catch (err) {
    clearTimeout(timeout);
    console.error('[OpenRouter] Fetch error:', err);
    if (err instanceof DOMException && err.name === 'AbortError') {
      console.error('[OpenRouter] Request timed out after', TIMEOUT_MS, 'ms');
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
  let chunkCount = 0;

  console.log('[OpenRouter] Stream reader created, starting read loop');

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      console.log('[OpenRouter] Stream done, total chunks:', chunkCount);
      break;
    }

    chunkCount++;
    const decoded = decoder.decode(value, { stream: true });
    console.log('[OpenRouter] DECODED CHUNK #' + chunkCount + ':', decoded.substring(0, 200));

    buffer += decoded;
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) {
        console.log('[OpenRouter] Skipping non-data line:', line.substring(0, 100));
        continue;
      }
      const json = line.slice(6).trim();
      if (json === '[DONE]') {
        console.log('[OpenRouter] Received [DONE] signal');
        continue;
      }
      try {
        const parsed = JSON.parse(json);
        const delta = parsed.choices?.[0]?.delta?.content || '';
        if (delta) {
          fullContent += delta;
          console.log('[OpenRouter] Delta content:', delta);
          onStream(delta);
        }
      } catch (e) { console.error('[OpenRouter] Stream parse error:', e, 'line:', line); }
    }
  }

  console.log('[OpenRouter] Stream finished, fullContent length:', fullContent.length);
  console.log('[OpenRouter] EXTRACTED full text:', fullContent);
  if (fullContent) setCache(messages, fullContent);
  return fullContent || "I couldn't generate a response. Please try again.";
}
