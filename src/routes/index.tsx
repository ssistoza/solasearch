import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const navigate = useNavigate({ from: '/' })

  const [query, setQuery] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    const params = new URLSearchParams(window.location.search)
    const registration = params.get('registration')
    if (!registration) {
      setAuthError('Missing ?registration= parameter. Add ?registration=shane to the URL.')
      return
    }
    setAuthError(null)
    navigate({
      to: '/search',
      search: { q: query.trim(), registration, page: 1 },
    })
  }

  return (
    <div className="flex flex-col h-dvh bg-base text-text">
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center gap-8 w-full max-w-lg">
          <h1 className="text-4xl font-bold text-text">Kagi</h1>
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                placeholder="Search the web..."
                className="w-full px-5 pr-14 py-3.5 rounded-full bg-surface0 text-lg text-text placeholder-overlay1 focus:outline-none focus:border-lavender focus:ring-1 focus:ring-lavender transition-colors"
              />
              <button
                type="submit"
                disabled={!query.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-surface1 hover:bg-surface2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            {authError && (
              <p className="text-red text-sm text-center mt-3">{authError}</p>
            )}
          </form>
        </div>
      </main>
    </div>
  )
}
