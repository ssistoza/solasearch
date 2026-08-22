import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { searchKagi, KagiWorkflow } from '../../utils/kagi';
import { Pagination } from '../../components/pagination';
import { TextSkeleton } from '../../components/skeletons';

export const Route = createFileRoute('/search/')({
  component: SearchAll,
});

function SearchAll() {
  const { q, registration, page } = Route.useSearch();

  const {
    data: results,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['search', q, registration, page],
    queryFn: () =>
      searchKagi({
        data: {
          query: q,
          deviceToken: registration,
          workflow: KagiWorkflow.Search,
          page,
          limit: 20,
        },
      }),
    enabled: !!q && !!registration,
  });

  if (isLoading) return <TextSkeleton />;

  if (error) {
    return (
      <div className='text-center py-12'>
        <p className='text-red mb-2'>Search failed</p>
        <p className='text-overlay1 text-sm'>{error.message}</p>
      </div>
    );
  }

  const webResults = results?.data?.search ?? [];

  if (!results) {
    return (
      <div className='text-center text-overlay1 py-12'>No results yet</div>
    );
  }

  return (
    <>
      <p className='text-overlay1 text-sm mb-4'>
        {webResults.length} results ({results.meta?.ms ?? 0}ms)
      </p>

      <div className='flex flex-col gap-5'>
        {webResults.map((result) => (
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

      {results.data?.related_search &&
        results.data.related_search.length > 0 && (
          <div className='mt-8 pt-6 border-t border-surface0'>
            <h3 className='text-overlay1 text-sm mb-2'>Related searches</h3>
            <div className='flex flex-wrap gap-2'>
              {results.data.related_search.map((related) => (
                <a
                  key={related.title}
                  href={`/search?q=${encodeURIComponent(related.title)}&registration=${registration}&page=1`}
                  className='px-3 py-1 rounded-full bg-surface0 hover:bg-surface1 text-sm text-subtext1 transition-colors'
                >
                  {related.title}
                </a>
              ))}
            </div>
          </div>
        )}

      <Pagination page={page} registration={registration} q={q} />
    </>
  );
}
