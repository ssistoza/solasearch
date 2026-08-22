import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { searchKagi, KagiWorkflow } from '../../utils/kagi';
import { Pagination } from '../../components/pagination';
import { TextSkeleton } from '../../components/skeletons';

export const Route = createFileRoute('/search/news')({
  component: SearchNews,
});

function SearchNews() {
  const { q, registration, page } = Route.useSearch();

  const { data: results, isPending, error } = useQuery({
    queryKey: ['search', 'news', q, registration, page],
    queryFn: () =>
      searchKagi({
        data: { query: q, deviceToken: registration, workflow: KagiWorkflow.News, page, limit: 20 },
      }),
    enabled: !!q && !!registration,
  });

  if (isPending) return <TextSkeleton />;

  if (error) {
    return (
      <div className='text-center py-12'>
        <p className='text-red mb-2'>Search failed</p>
        <p className='text-overlay1 text-sm'>{error.message}</p>
      </div>
    );
  }

  const newsResults = results?.data?.news ?? [];

  if (!results) {
    return <div className='text-center text-overlay1 py-12'>No results yet</div>;
  }

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

      <Pagination page={page} registration={registration} q={q} />
    </>
  );
}
