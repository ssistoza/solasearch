interface SuggestListProps {
  items: string[];
  activeIndex: number;
  listId: string;
  onSelect: (item: string) => void;
  onHover?: (index: number) => void;
}

export function SuggestList({ items, activeIndex, listId, onSelect, onHover }: SuggestListProps) {
  if (items.length === 0) return null;

  return (
    <ul
      id={listId}
      role='listbox'
      aria-label='Search suggestions'
      className='absolute inset-x-0 top-full z-20 mt-1.5 overflow-hidden rounded-xl border border-surface0 bg-crust py-1 shadow-lg shadow-black/40'
    >
      {items.map((item, i) => (
        <li key={item} id={`${listId}-opt-${i}`} role='option' aria-selected={i === activeIndex}>
          <button
            type='button'
            tabIndex={-1}
            onMouseEnter={() => onHover?.(i)}
            onMouseLeave={() => onHover?.(-1)}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(item);
            }}
            className={`w-full cursor-pointer truncate px-4 py-2 text-left text-sm transition-colors ${
              i === activeIndex ? 'bg-mantle text-mauve' : 'text-text'
            }`}
          >
            {item}
          </button>
        </li>
      ))}
    </ul>
  );
}
