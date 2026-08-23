import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import * as z from 'zod/mini';
import { resolveBang } from '#/utils/bangs';

const TABS = [
  { key: 'search', label: 'all', to: '/search' as const },
  { key: 'images', label: 'images', to: '/search/images' as const },
  { key: 'videos', label: 'videos', to: '/search/videos' as const },
  { key: 'news', label: 'news', to: '/search/news' as const },
];

const searchSchema = z.object({
  q: z.catch(z.string(), ''),
  registration: z.catch(z.string(), ''),
  page: z.catch(z.number(), 1),
});

export const Route = createFileRoute('/search')({
  validateSearch: searchSchema,
  errorComponent: ErrorPage,
  component: SearchLayout,
});

function ErrorPage({ error }: { error: Error }) {
  return (
    <div className='flex items-center justify-center h-dvh bg-base text-text'>
      <div className='flex flex-col items-center gap-4 text-center max-w-md'>
        <div className='text-6xl text-red font-bold'>!</div>
        <h1 className='text-2xl font-semibold'>Configuration Error</h1>
        <p className='text-subtext0'>{error.message}</p>
        <p className='text-overlay1 text-sm'>
          Add{' '}
          <code className='bg-surface0 px-1.5 py-0.5 rounded text-subtext1'>
            ?registration=shane
          </code>{' '}
          to the URL.
        </p>
      </div>
    </div>
  );
}

function SearchLayout() {
  const { q: urlQuery, registration } = Route.useSearch();
  const navigate = useNavigate({ from: '/search' });

  const [query, setQuery] = useState(urlQuery);

  const deviceToken = registration || null;
  const [authError, setAuthError] = useState(
    deviceToken
      ? null
      : 'Missing ?registration= parameter. Add ?registration=shane to the URL.'
  );

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    const bang = resolveBang(trimmed);
    if (bang) {
      window.location.href = bang.url;
      return;
    }
    if (!deviceToken) {
      setAuthError(
        'Missing ?registration= parameter. Add ?registration=shane to the URL.'
      );
      return;
    }
    setAuthError(null);
    navigate({
      to: '/search',
      search: { q: trimmed, registration, page: 1 },
    });
  }

  const searchLinkParams = { q: urlQuery, registration, page: 1 };

  const bang = resolveBang(query);

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isImages = pathname === '/search/images';
  const isVideos = pathname === '/search/videos';
  const isNews = pathname === '/search/news';

  return (
    <div className='flex flex-col h-dvh bg-base text-text'>
      <header className='shrink-0 bg-base border-b border-surface0'>
        <div className='max-w-3xl mx-auto px-4 py-3 flex items-center gap-4'>
          <a
            href={`/?registration=${registration}`}
            className='text-lg font-bold tracking-tighter text-text shrink-0'
          >
            kagi<span className='text-mauve'>.</span>
          </a>
          <form onSubmit={handleSearch} className='flex-1'>
            <div className='flex items-center rounded-lg border border-surface0 bg-crust transition-colors focus-within:border-mauve/60 focus-within:bg-mantle'>
              <span aria-hidden className='select-none pl-3 text-mauve'>&gt;</span>
              <input
                type='text'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                spellCheck={false}
                autoComplete='off'
                placeholder='search the web'
                className='w-full min-w-0 bg-transparent px-3 py-2 text-base text-text placeholder-overlay1 focus:outline-none'
              />
              {bang && (
                <span className='hidden sm:block shrink-0 pr-2 text-xs text-green truncate max-w-40'>
                  → {new URL(bang.url).hostname}
                </span>
              )}
              <button
                type='submit'
                disabled={!query.trim()}
                aria-label='Search'
                className='mr-1.5 shrink-0 rounded-md p-1.5 text-overlay1 transition-colors hover:bg-surface0 hover:text-text disabled:cursor-not-allowed disabled:opacity-30 enabled:cursor-pointer'
              >
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='w-4 h-4'>
                  <path fillRule='evenodd' d='M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z' clipRule='evenodd' />
                </svg>
              </button>
            </div>
          </form>
        </div>
        <nav className='max-w-3xl mx-auto px-4 flex gap-1'>
          {TABS.map((tab) => {
            const isActive =
              tab.to === '/search'
                ? !isImages && !isVideos && !isNews
                : tab.to === '/search/images'
                  ? isImages
                  : tab.to === '/search/videos'
                    ? isVideos
                    : isNews;
            return (
              <Link
                key={tab.key}
                to={tab.to}
                search={searchLinkParams}
                preload='intent'
                className={`px-4 py-2 text-sm tracking-wide transition-colors cursor-pointer ${
                  isActive
                    ? 'text-mauve border-b-2 border-mauve'
                    : 'text-overlay1 hover:text-subtext1'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-surface2 scrollbar-track-transparent'>
        <div className='max-w-3xl mx-auto px-4 py-6'>
          {authError && (
            <div className='text-center py-12'>
              <p className='text-red mb-2'>Configuration Error</p>
              <p className='text-overlay1 text-sm'>{authError}</p>
            </div>
          )}

          {!authError && <Outlet />}
        </div>
      </main>
    </div>
  );
}
