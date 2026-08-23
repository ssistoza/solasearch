import { createFileRoute } from '@tanstack/react-router';
import {
  searchKagi,
  KagiWorkflow,
  type KagiSearchResponse,
} from '../../utils/kagi';
import { Pagination } from '../../components/pagination';
import { TextSkeleton } from '../../components/skeletons';

interface SearchLoaderData {
  results: KagiSearchResponse | null;
  error?: string;
}

export const Route = createFileRoute('/search/news')({
  component: SearchNews,
  pendingComponent: TextSkeleton,
  pendingMs: 100,
  loaderDeps: ({ search }) => ({
    q: search.q,
    token: search.token,
    page: search.page,
  }),
  loader: async ({ deps }): Promise<SearchLoaderData> => {
    if (!deps.q || !deps.token) return { results: null };
    try {
      const results = await searchKagi({
        data: {
          query: deps.q,
          deviceToken: deps.token,
          workflow: KagiWorkflow.News,
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

function SearchNews() {
  const { q, token, page } = Route.useSearch();
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

  const newsResults = results.data.news ?? [];

  return (
    <>
      <p className='text-overlay1 text-sm mb-4'>
        {newsResults.length} results ({results.meta?.ms ?? 0}ms)
      </p>

      <div className='flex flex-col gap-5'>
        {newsResults.map((result) => (
          <article key={result.url} className='group'>
            <a
              href={result.url}
              target='_blank'
              rel='noopener noreferrer'
              className='block'
            >
              <h2 className='text-lg text-mauve group-hover:underline leading-snug'>
                {result.title}
              </h2>
              <div className='text-xs text-overlay1 truncate mt-0.5'>
                {result.url}
              </div>
              {result.snippet && (
                <p
                  className='text-subtext0 text-sm mt-1 line-clamp-2 leading-relaxed [&_b]:text-text'
                  dangerouslySetInnerHTML={{ __html: result.snippet }}
                />
              )}
            </a>
          </article>
        ))}
      </div>

      <Pagination page={page} token={token} q={q} />
    </>
  );
}
