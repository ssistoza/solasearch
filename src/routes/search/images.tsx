import { createFileRoute } from '@tanstack/react-router';
import {
  searchKagi,
  KagiWorkflow,
  type KagiSearchResponse,
} from '../../utils/kagi';
import { Pagination } from '../../components/pagination';
import { ImageSkeleton } from '../../components/skeletons';

interface SearchLoaderData {
  results: KagiSearchResponse | null;
  error?: string;
}

export const Route = createFileRoute('/search/images')({
  component: SearchImages,
  pendingComponent: ImageSkeleton,
  pendingMs: 100,
  loaderDeps: ({ search }) => ({
    q: search.q,
    registration: search.registration,
    page: search.page,
  }),
  loader: async ({ deps }): Promise<SearchLoaderData> => {
    if (!deps.q || !deps.registration) return { results: null };
    try {
      const results = await searchKagi({
        data: {
          query: deps.q,
          deviceToken: deps.registration,
          workflow: KagiWorkflow.Images,
          page: deps.page,
          limit: 20,
        },
      });
      return { results };
    } catch (error) {
      return {
        results: null,
        error: error instanceof Error ? error.message : 'Search failed',
      };
    }
  },
});

function SearchImages() {
  const { q, registration, page } = Route.useSearch();
  const { results, error } = Route.useLoaderData();

  if (error) {
    return (
      <div className='text-center py-12'>
        <p className='text-red mb-2'>Search failed</p>
        <p className='text-overlay1 text-sm'>{error}</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className='text-center text-overlay1 py-12'>No results yet</div>
    );
  }

  const imageResults = results.data.image ?? [];

  return (
    <>
      <p className='text-overlay1 text-sm mb-4'>
        {imageResults.length} results ({results.meta?.ms ?? 0}ms)
      </p>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
        {imageResults.map((result) => (
          <a
            key={result.url}
            href={result.url}
            target='_blank'
            rel='noopener noreferrer'
            className='group rounded-lg overflow-hidden bg-surface0/50'
          >
            {result.image?.url && (
              <img
                src={result.image.url}
                alt={result.title}
                className='w-full h-32 object-cover'
              />
            )}
            <div className='px-2 py-1.5'>
              <div className='text-xs text-subtext1 truncate'>
                {result.title}
              </div>
            </div>
          </a>
        ))}
      </div>

      <Pagination page={page} registration={registration} q={q} />
    </>
  );
}
