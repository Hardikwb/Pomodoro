import { useEffect, useState } from 'react'

// Small popover-style settings panel. Lets the user adjust work / short break /
// long break durations and how many work blocks happen before a long break.
// Validates that every value is a positive number, clamped to a sensible range.

const DEFAULTS = { work: 25, short: 5, long: 15, cyclesBeforeLong: 4 }
const LIMITS = {
  work: { min: 1, max: 120 },
  short: { min: 1, max: 60 },
  long: { min: 1, max: 90 },
  cyclesBeforeLong: { min: 2, max: 8 },
}

function clamp(value, min, max) {
  if (Number.isNaN(value)) return min
  return Math.min(max, Math.max(min, value))
}

export default function TimerSettings({ settings, onChange, onClose }) {
  const [draft, setDraft] = useState(settings)

  // Re-sync if the parent's settings change (e.g. localStorage hydration).
  useEffect(() => { setDraft(settings) }, [settings])

  // Close on Escape.
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function setField(key, raw) {
    const next = Number(raw)
    const { min, max } = LIMITS[key]
    setDraft((d) => ({ ...d, [key]: clamp(next, min, max) }))
  }

  function save() {
    onChange(draft)
    onClose()
  }

  function resetDefaults() {
    setDraft(DEFAULTS)
  }

  return (
    <div className="settings-backdrop" onClick={onClose} role="presentation">
      <div
        className="settings-panel glass"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="settings-header">
          <h2 id="settings-title">Timer settings</h2>
          <button type="button" className="btn btn-icon" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <div className="settings-grid">
          <label className="settings-field">
            <span>Work (min)</span>
            <input
              type="number"
              min={LIMITS.work.min}
              max={LIMITS.work.max}
              value={draft.work}
              onChange={(e) => setField('work', e.target.value)}
            />
          </label>

          <label className="settings-field">
            <span>Short break (min)</span>
            <input
              type="number"
              min={LIMITS.short.min}
              max={LIMITS.short.max}
              value={draft.short}
              onChange={(e) => setField('short', e.target.value)}
            />
          </label>

          <label className="settings-field">
            <span>Long break (min)</span>
            <input
              type="number"
              min={LIMITS.long.min}
              max={LIMITS.long.max}
              value={draft.long}
              onChange={(e) => setField('long', e.target.value)}
            />
          </label>

          <label className="settings-field">
            <span>Work blocks before long break</span>
            <input
              type="number"
              min={LIMITS.cyclesBeforeLong.min}
              max={LIMITS.cyclesBeforeLong.max}
              value={draft.cyclesBeforeLong}
              onChange={(e) => setField('cyclesBeforeLong', e.target.value)}
            />
          </label>
        </div>

        <footer className="settings-footer">
          <button type="button" className="btn btn-ghost" onClick={resetDefaults}>
            Reset defaults
          </button>
          <button type="button" className="btn btn-primary" onClick={save}>
            Save
          </button>
        </footer>
      </div>
    </div>
  )
}