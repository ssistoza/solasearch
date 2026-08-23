import { createServerFn } from '@tanstack/react-start';

const DDG_SUGGEST_URL = 'https://duckduckgo.com/ac/?type=list';
const MAX_SUGGESTIONS = 8;
const TIMEOUT_MS = 3000;

interface SuggestInput {
  query: string;
}

export const getSuggestions = createServerFn({ method: 'POST' })
  .validator((input: SuggestInput) => input)
  .handler(async ({ data }): Promise<{ suggestions: string[] }> => {
    const query = data.query.trim();
    if (query.length < 3) {
      return { suggestions: [] };
    }

    try {
      const response = await fetch(
        `${DDG_SUGGEST_URL}&q=${encodeURIComponent(query)}`,
        {
          headers: { accept: 'application/json' },
          signal: AbortSignal.timeout(TIMEOUT_MS),
        }
      );
      if (!response.ok) {
        return { suggestions: [] };
      }
      const payload = (await response.json()) as [string, string[]];
      const suggestions = Array.isArray(payload?.[1])
        ? payload[1].slice(0, MAX_SUGGESTIONS)
        : [];
      return { suggestions };
    } catch {
      return { suggestions: [] };
    }
  });
