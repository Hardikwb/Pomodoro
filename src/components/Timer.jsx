import { useEffect, useRef, useState } from 'react'

// Pomodoro countdown. Derives secondsLeft from a real wall-clock deadline so
// the value stays accurate even if the browser throttles the interval tick.

const PHASE_LABEL = {
  work: 'Work',
  short: 'Short break',
  long: 'Long break',
}

// Plays a short two-tone chime using the Web Audio API. No audio file needed.
// Skips silently if AudioContext isn't available (very old browsers).
function playChime() {
  try {
    const Ctor = window.AudioContext || window.webkitAudioContext
    if (!Ctor) return
    const ctx = new Ctor()
    const now = ctx.currentTime
    const tones = [
      { freq: 880, start: 0.0, dur: 0.18 },
      { freq: 1320, start: 0.2, dur: 0.32 },
    ]
    for (const tone of tones) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = tone.freq
      gain.gain.setValueAtTime(0.0001, now + tone.start)
      gain.gain.exponentialRampToValueAtTime(0.25, now + tone.start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + tone.start + tone.dur)
      osc.connect(gain).connect(ctx.destination)
      osc.start(now + tone.start)
      osc.stop(now + tone.start + tone.dur + 0.05)
    }
    // Close the context once the longest tone has finished.
    window.setTimeout(() => ctx.close(), 800)
  } catch {
    // ignore
  }
}

function notify(phase) {
  if (typeof Notification === 'undefined') return
  if (Notification.permission !== 'granted') return
  try {
    new Notification('Focus Pomodoro', {
      body: `${PHASE_LABEL[phase] ?? phase} is up.`,
      silent: true,
    })
  } catch {
    // ignore
  }
}

function format(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function Timer({ settings }) {
  const { work, short, long, cyclesBeforeLong } = settings

  const [phase, setPhase] = useState('work')
  const [cycleIndex, setCycleIndex] = useState(0) // 0-based: which work block we are in
  const [isRunning, setIsRunning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(work * 60)

  // The wall-clock moment the current phase ends. Stored in a ref so changing
  // it doesn’t trigger a re-render — only the displayed `secondsLeft` does.
  const phaseEndsAtRef = useRef(null)

  const phaseDurationMin = phase === 'work' ? work : phase === 'short' ? short : long

  // When settings or phase change, reset the countdown to a full phase and
  // stop running. We don’t want a settings tweak to silently keep ticking.
  useEffect(() => {
    setSecondsLeft(phaseDurationMin * 60)
    setIsRunning(false)
    phaseEndsAtRef.current = null
  }, [phaseDurationMin, phase])

  // Ask for notification permission the first time the user starts the timer.
  function ensureNotificationPermission() {
    if (typeof Notification === 'undefined') return
    if (Notification.permission === 'default') {
      try { Notification.requestPermission() } catch { /* ignore */ }
    }
  }

  function advancePhase() {
    playChime()
    notify(phase)

    setPhase((prev) => {
      if (prev === 'work') {
        const nextCycle = cycleIndex + 1
        setCycleIndex(nextCycle)
        // After every `cyclesBeforeLong` work blocks, take a long break.
        if (nextCycle % cyclesBeforeLong === 0) return 'long'
        return 'short'
      }
      // Either break just ended → back to work.
      return 'work'
    })
  }

  // The tick. Runs every 250ms while running, recomputes from wall-clock time.
  useEffect(() => {
    if (!isRunning) return

    const tick = () => {
      const endsAt = phaseEndsAtRef.current
      if (endsAt == null) return
      const remainingMs = endsAt - Date.now()
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000))
      setSecondsLeft(remainingSec)
      if (remainingSec <= 0) {
        phaseEndsAtRef.current = null
        setIsRunning(false)
        advancePhase()
      }
    }

    tick()
    const id = window.setInterval(tick, 250)
    return () => window.clearInterval(id)
    // We intentionally exclude advancePhase/phase from deps to avoid resetting
    // the interval mid-phase. advancePhase is stable enough through state setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, phase])

  function handleStart() {
    if (isRunning) {
      setIsRunning(false)
      phaseEndsAtRef.current = null
      return
    }
    ensureNotificationPermission()
    phaseEndsAtRef.current = Date.now() + secondsLeft * 1000
    setIsRunning(true)
  }

  function handleReset() {
    setIsRunning(false)
    phaseEndsAtRef.current = null
    setSecondsLeft(phaseDurationMin * 60)
  }

  return (
    <section className="timer glass" aria-label="Pomodoro timer">
      <p className="timer-phase">
        <span className={`timer-phase-dot phase-${phase}`} aria-hidden="true" />
        {PHASE_LABEL[phase]}
        <span className="timer-cycle"> · {Math.min(cycleIndex + 1, cyclesBeforeLong)} / {cyclesBeforeLong}</span>
      </p>

      <p className="timer-display" aria-live="off">
        {format(secondsLeft)}
      </p>

      <div className="timer-actions">
        <button type="button" className="btn btn-primary" onClick={handleStart}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={handleReset}>
          Reset
        </button>
      </div>
    </section>
  )
}