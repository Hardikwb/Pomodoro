import { BACKGROUNDS } from '../data/backgrounds'

// A row of small preset chips. The active chip is highlighted with a ring.
// The chip itself is just a styled div with the preset's CSS background,
// so it previews the gradient exactly as it will look on the screen.

export default function BackgroundPicker({ activeId, onSelect }) {
  return (
    <div className="bg-picker" role="radiogroup" aria-label="Background presets">
      {BACKGROUNDS.map((bg) => {
        const isActive = bg.id === activeId
        return (
          <button
            key={bg.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={bg.label}
            title={bg.label}
            className={`bg-chip ${isActive ? 'is-active' : ''}`}
            style={{ background: bg.value }}
            onClick={() => onSelect(bg)}
          />
        )
      })}
    </div>
  )
}