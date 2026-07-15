import { useCallback, useEffect, useRef, useState } from 'react'

export function useStopwatch() {
  const [elapsedMs, setElapsedMs] = useState(0)
  const [running, setRunning] = useState(false)
  const startRef = useRef(0)

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => setElapsedMs(Date.now() - startRef.current), 50)
    return () => window.clearInterval(id)
  }, [running])

  const start = useCallback(() => {
    startRef.current = Date.now() - elapsedMs
    setRunning(true)
  }, [elapsedMs])

  const stop = useCallback(() => setRunning(false), [])

  const reset = useCallback(() => {
    setRunning(false)
    setElapsedMs(0)
  }, [])

  return { elapsedMs, running, start, stop, reset }
}
