import { useCallback, useEffect, useState } from 'react'
import { ENDING_VIDEO_SRC, getGameImageUrls } from '../constants/gameAssets'
import { preloadImage, preloadVideo } from '../utils/preloadAssets'

export function useGamePreload() {
  const [status, setStatus] = useState('loading')
  const [progress, setProgress] = useState(0)
  const [retryKey, setRetryKey] = useState(0)

  const retry = useCallback(() => {
    setRetryKey((k) => k + 1)
  }, [])

  useEffect(() => {
    let cancelled = false
    const imageUrls = [...new Set(getGameImageUrls())]
    const totalSteps = imageUrls.length + 1

    async function run() {
      setStatus('loading')
      setProgress(0)

      let loaded = 0
      let failures = 0

      const bump = () => {
        loaded += 1
        if (!cancelled) {
          setProgress(Math.round((loaded / totalSteps) * 100))
        }
      }

      for (const url of imageUrls) {
        if (cancelled) return
        try {
          await preloadImage(url)
        } catch {
          failures += 1
        }
        bump()
      }

      if (cancelled) return
      try {
        await preloadVideo(ENDING_VIDEO_SRC)
      } catch {
        failures += 1
      }
      bump()

      if (cancelled) return
      setProgress(100)
      setStatus(failures === 0 ? 'ready' : 'error')
    }

    run()
    return () => {
      cancelled = true
    }
  }, [retryKey])

  return {
    status,
    progress,
    isReady: status === 'ready',
    hasError: status === 'error',
    retry,
  }
}
