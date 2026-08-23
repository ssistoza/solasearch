import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useRef, useState, type FormEvent } from 'react'
import { resolveBang } from '#/utils/bangs'

export const Route = createFileRoute('/')({
  component: Home,
})

const BANG_HINTS = ['gh', 'w', 'yt', 'so', 'mdn', 'npm']

function Home() {
  const navigate = useNavigate({ from: '/' })

  const [query, setQuery] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const bang = resolveBang(query)

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    const bang = resolveBang(trimmed)
    if (bang) {
      window.location.href = bang.url
      return
    }
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (!token) {
      setAuthError('Missing or invalid ?token= parameter.')
      return
    }
    setAuthError(null)
    navigate({
      to: '/search',
      search: { q: trimmed, token, page: 1 },
    })
  }

  function handleBangChip(key: string) {
    setQuery(`!${key} `)
    inputRef.current?.focus()
  }

  return (
    <div className='relative flex min-h-dvh flex-col bg-base text-text'>
      <div aria-hidden className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='absolute left-1/2 top-[-220px] h-[560px] w-[880px] -translate-x-1/2 rounded-full bg-mauve/10 blur-[120px]' />
      </div>

      <main className='relative flex flex-1 flex-col items-center justify-center px-4'>
        <div className='flex w-full max-w-xl flex-col items-center gap-10'>
          <header className='flex flex-col items-center gap-3'>
            <h1 className='text-5xl font-bold tracking-tighter'>
              kagi<span className='text-mauve'>.</span>
            </h1>
            <p className='text-sm text-overlay1'>fast private web search</p>
          </header>

          <form onSubmit={handleSearch} className='w-full'>
            <div className='flex items-center rounded-xl border border-surface0 bg-crust transition-colors focus-within:border-mauve/60 focus-within:bg-mantle'>
              <span aria-hidden className='select-none pl-4 text-lg text-mauve'>&gt;</span>
              <input
                ref={inputRef}
                type='text'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                spellCheck={false}
                autoComplete='off'
                placeholder='search the web'
                className='w-full bg-transparent px-3 py-3.5 text-base text-text placeholder-overlay1 focus:outline-none'
              />
              <button
                type='submit'
                disabled={!query.trim()}
                aria-label='Search'
                className='mr-2 rounded-lg p-2 text-overlay1 transition-colors hover:bg-surface0 hover:text-text disabled:cursor-not-allowed disabled:opacity-30 enabled:cursor-pointer'
              >
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='h-5 w-5'>
                  <path fillRule='evenodd' d='M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z' clipRule='evenodd' />
                </svg>
              </button>
            </div>

            {bang && (
              <p className='mt-2 pl-1 text-xs text-green'>
                → {bang.bang.name.toLowerCase()} · {new URL(bang.url).hostname}
              </p>
            )}

            {authError && (
              <p className='mt-3 text-center text-sm text-red'>{authError}</p>
            )}
          </form>

          <section className='flex flex-col items-center gap-3'>
            <p className='text-xs uppercase tracking-[0.2em] text-overlay0'>try a bang</p>
            <div className='flex flex-wrap justify-center gap-2'>
              {BANG_HINTS.map((key) => (
                <button
                  key={key}
                  type='button'
                  onClick={() => handleBangChip(key)}
                  className='rounded-full border border-surface0 bg-mantle px-3 py-1 text-xs text-subtext0 transition-colors hover:border-green/50 hover:text-text cursor-pointer'
                >
                  !{key}
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className='relative pb-6 text-center text-xs text-overlay0'>
        results by kagi api · bangs redirect direct
      </footer>
    </div>
  )
}
