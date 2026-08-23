import { useEffect, useRef, useState } from 'react';
import { getSuggestions } from '#/utils/suggest';

const DEBOUNCE_MS = 250;
const MIN_QUERY_LENGTH = 3;

export function useAutosuggest(query: string) {
  const [items, setItems] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const requestId = useRef(0);

  const trimmed = query.trim();
  const disabled = trimmed.length < MIN_QUERY_LENGTH || trimmed.startsWith('!');

  useEffect(() => {
    setActiveIndex(-1);
    if (disabled) {
      setItems([]);
      return;
    }
    const id = ++requestId.current;
    const timer = setTimeout(async () => {
      try {
        const { suggestions } = await getSuggestions({ data: { query: trimmed } });
        if (requestId.current === id) {
          setItems(suggestions);
        }
      } catch {
        if (requestId.current === id) {
          setItems([]);
        }
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [trimmed, disabled]);

  function reset() {
    requestId.current++;
    setItems([]);
    setActiveIndex(-1);
  }

  return { items, activeIndex, setActiveIndex, reset };
}
