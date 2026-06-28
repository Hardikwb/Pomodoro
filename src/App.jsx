import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { useLocalStorage } from './hooks/useLocalStorage'
import { DEFAULT_BACKGROUND } from './data/backgrounds'
import { LOCAL_QUOTES } from './data/quotes'
import BackgroundPicker from './components/BackgroundPicker'
import QuoteCard from './components/QuoteCard'
import Timer from './components/Timer'
import TimerSettings from './components/TimerSettings'

const DEFAULT_SETTINGS = {
  work: 25,
  short: 5,
  long: 15,
  cyclesBeforeLong: 4,
}

const STORAGE_KEYS = {
  background: 'pomodoro:background',
  settings: 'pomodoro:settings',
}

// Backgrounds with a dark tonal range — used to flip the foreground palette
// via a body[data-bg] attribute that index.css reads.
const DARK_BACKGROUNDS = new Set(['midnight', 'forest', 'ocean', 'lavender'])

function App() {
  const [background, setBackground] = useLocalStorage(
    STORAGE_KEYS.background,
    DEFAULT_BACKGROUND,
  )
  const [settings, setSettings] = useLocalStorage(
    STORAGE_KEYS.settings,
    DEFAULT_SETTINGS,
  )

  // Quotes live in memory only. Fetched quotes from the API are appended here
  // so the QuoteCard can cycle through them too.
  const [extraQuotes, setExtraQuotes] = useState([])
  const quotes = useMemo(() => [...LOCAL_QUOTES, ...extraQuotes], [extraQuotes])

  const [showSettings, setShowSettings] = useState(false)

  // Sync a body attribute so CSS can switch palettes per background.
  useEffect(() => {
    document.body.dataset.bg = DARK_BACKGROUNDS.has(background.id) ? 'dark' : 'light'
  }, [background.id])

  function addQuotes(more) {
    setExtraQuotes((prev) => [...prev, ...more])
  }

  return (
    <main
      className="app"
      style={{ backgroundImage: background.value }}
    >
      <header className="app-topbar">
        <BackgroundPicker
          activeId={background.id}
          onSelect={setBackground}
        />
        <button
          type="button"
          className="btn btn-icon btn-ghost settings-trigger"
          onClick={() => setShowSettings(true)}
          aria-label="Open timer settings"
          title="Timer settings"
        >
          ⚙
        </button>
      </header>

      <section className="app-content">
        <QuoteCard quotes={quotes} onAddQuotes={addQuotes} />
        <Timer settings={settings} />
      </section>

      {showSettings && (
        <TimerSettings
          settings={settings}
          onChange={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </main>
  )
}

export default App