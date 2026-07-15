import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'tractions0max:recupEndAt'

function beep() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = 880
    osc.connect(gain)
    gain.connect(ctx.destination)
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
    osc.start()
    osc.stop(ctx.currentTime + 0.5)
    osc.onended = () => ctx.close()
  } catch {
    // audio indisponible, tant pis
  }
}

/** Timer de récupération plein écran, résistant au verrouillage/arrière-plan via horodatage persisté. */
export function useRecoveryTimer() {
  const [endAt, setEndAt] = useState<number | null>(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? Number(raw) : null
  })
  const [remaining, setRemaining] = useState(0)
  const finishedRef = useRef(false)

  useEffect(() => {
    if (endAt === null) {
      setRemaining(0)
      return
    }
    finishedRef.current = false
    const tick = () => {
      const r = Math.max(0, Math.round((endAt - Date.now()) / 1000))
      setRemaining(r)
      if (r === 0 && !finishedRef.current) {
        finishedRef.current = true
        if (navigator.vibrate) navigator.vibrate([200, 100, 200])
        beep()
      }
    }
    tick()
    const id = window.setInterval(tick, 250)
    return () => window.clearInterval(id)
  }, [endAt])

  const start = useCallback((durationSec: number) => {
    const end = Date.now() + durationSec * 1000
    localStorage.setItem(STORAGE_KEY, String(end))
    setEndAt(end)
  }, [])

  const addSeconds = useCallback(
    (sec: number) => {
      if (endAt === null) return
      const end = endAt + sec * 1000
      localStorage.setItem(STORAGE_KEY, String(end))
      setEndAt(end)
    },
    [endAt],
  )

  const stop = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setEndAt(null)
    setRemaining(0)
  }, [])

  return { remaining, isRunning: endAt !== null, start, addSeconds, stop }
}
