import {
  createFileRoute,
  Link,
  Outlet,
  useRouterState,
} from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import * as z from 'zod/mini';

const TABS = [
  { key: 'search', label: 'All', to: '/search' as const },
  { key: 'images', label: 'Images', to: '/search/images' as const },
  { key: 'videos', label: 'Videos', to: '/search/videos' as const },
  { key: 'news', label: 'News', to: '/search/news' as const },
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

  const [query, setQuery] = useState(urlQuery);

  const deviceToken = registration || null;
  const [authError, setAuthError] = useState(
    deviceToken
      ? null
      : 'Missing ?registration= parameter. Add ?registration=shane to the URL.'
  );

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    if (!deviceToken) {
      setAuthError(
        'Missing ?registration= parameter. Add ?registration=shane to the URL.'
      );
      return;
    }
    setAuthError(null);
    window.location.href = `/search?q=${encodeURIComponent(query.trim())}&registration=${registration}&page=1`;
  }

  const searchLinkParams = { q: urlQuery, registration, page: 1 };

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
            className='text-lg font-bold text-text shrink-0'
          >
            Kagi
          </a>
          <form onSubmit={handleSearch} className='flex-1'>
            <div className='relative'>
              <input
                type='text'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                placeholder='Search the web...'
                className='w-full px-4 pr-12 py-2 rounded-full bg-surface0 text-text placeholder-overlay1 focus:outline-none focus:border-lavender focus:ring-1 focus:ring-lavender transition-colors'
              />
              <button
                type='submit'
                disabled={!query.trim()}
                className='absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-surface1 hover:bg-surface2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer'
              >
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='w-4 h-4'>
                  <path fillRule='evenodd' d='M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z' clipRule='evenodd' />
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
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'text-blue border-b-2 border-blue'
                    : 'text-subtext0 hover:text-subtext1'
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
