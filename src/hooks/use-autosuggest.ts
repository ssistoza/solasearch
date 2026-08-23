import { useRef, useState } from 'react';
import { getSuggestions } from '#/utils/suggest';

const DEBOUNCE_MS = 250;
const MIN_QUERY_LENGTH = 3;
const BLUR_DISMISS_MS = 120;

export function useAutosuggest(initialQuery = '') {
  const [items, setItems] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [focused, setFocused] = useState(false);
  const requestId = useRef(0);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismiss = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFocused = useRef(false);
  const lastHandled = useRef(initialQuery.trim());

  function trackChange(query: string) {
    const trimmed = query.trim();
    setActiveIndex(-1);
    if (debounce.current) clearTimeout(debounce.current);
    if (trimmed === lastHandled.current) return;
    lastHandled.current = trimmed;
    if (
      !isFocused.current ||
      trimmed.length < MIN_QUERY_LENGTH ||
      trimmed.startsWith('!')
    ) {
      setItems([]);
      return;
    }
    const id = ++requestId.current;
    debounce.current = setTimeout(async () => {
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
  }

  function onFocus() {
    isFocused.current = true;
    if (dismiss.current) {
      clearTimeout(dismiss.current);
      dismiss.current = null;
    }
    setFocused(true);
  }

  function onBlur() {
    isFocused.current = false;
    setFocused(false);
    dismiss.current = setTimeout(() => {
      dismiss.current = null;
      setItems([]);
      setActiveIndex(-1);
    }, BLUR_DISMISS_MS);
  }

  function reset() {
    if (debounce.current) clearTimeout(debounce.current);
    requestId.current++;
    setItems([]);
    setActiveIndex(-1);
  }

  return { items, activeIndex, setActiveIndex, open: focused && items.length > 0, trackChange, onFocus, onBlur, reset };
}
