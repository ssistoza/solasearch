import { useNavigate, useRouterState } from '@tanstack/react-router';

interface PaginationProps {
  page: number;
  token: string;
  q: string;
}

export function Pagination({ page, token, q }: PaginationProps) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  function handlePageChange(newPage: number) {
    navigate({ to: pathname, search: { q, token, page: newPage } });
  }

  return (
    <div className='flex justify-center gap-2 mt-8'>
      {page > 1 && (
        <button
          onClick={() => handlePageChange(page - 1)}
          className='px-4 py-2 rounded-lg bg-surface0 hover:bg-surface1 text-sm transition-colors cursor-pointer'
        >
          Previous
        </button>
      )}
      <span className='px-4 py-2 text-sm text-subtext0'>Page {page}</span>
      {page < 20 && (
        <button
          onClick={() => handlePageChange(page + 1)}
          className='px-4 py-2 rounded-lg bg-surface0 hover:bg-surface1 text-sm transition-colors cursor-pointer'
        >
          Next
        </button>
      )}
    </div>
  );
}
