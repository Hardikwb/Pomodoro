import { useEffect, useState } from 'react'

// Displays one quote at a time, can cycle through the local list, and can fetch
// fresh quotes from a public API. Fetched quotes are appended to the in-memory
// list so subsequent "New Quote" clicks may surface them too.

const API_URL = 'https://api.quotable.io/random'

export default function QuoteCard({ quotes, onAddQuotes }) {
  const [index, setIndex] = useState(0)
  const [isFading, setIsFading] = useState(false)
  const [fetchStatus, setFetchStatus] = useState('idle') // 'idle' | 'loading' | 'error'
  const [errorMsg, setErrorMsg] = useState('')

  // Reset to a valid index if the quote list shrinks (e.g. parent remounts).
  useEffect(() => {
    if (index >= quotes.length) setIndex(0)
  }, [quotes.length, index])

  const quote = quotes[index] ?? quotes[0]

  function nextQuote() {
    setIsFading(true)
    // Wait for the fade-out, then swap the quote and fade back in.
    window.setTimeout(() => {
      setIndex((i) => (i + 1) % Math.max(quotes.length, 1))
      setIsFading(false)
    }, 180)
  }

  async function fetchMore() {
    setFetchStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (!data?.content) throw new Error('Bad payload')
      onAddQuotes([{ text: data.content, author: data.author || 'Unknown' }])
      setFetchStatus('idle')
    } catch (err) {
      setFetchStatus('error')
      setErrorMsg(err.message || 'Network error')
    }
  }

  if (!quote) return null

  return (
    <section className="quote-card glass" aria-live="polite">
      <blockquote className={`quote-text ${isFading ? 'is-fading' : ''}`}>
        “{quote.text}”
      </blockquote>
      <p className={`quote-author ${isFading ? 'is-fading' : ''}`}>
        — {quote.author}
      </p>

      <div className="quote-actions">
        <button type="button" className="btn btn-primary" onClick={nextQuote}>
          New Quote
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={fetchMore}
          disabled={fetchStatus === 'loading'}
        >
          {fetchStatus === 'loading' ? 'Fetching…' : 'Fetch more'}
        </button>
      </div>

      {fetchStatus === 'error' && (
        <p className="quote-error" role="alert">
          Couldn’t reach the quote service ({errorMsg}). Showing local quotes.
        </p>
      )}
    </section>
  )
}