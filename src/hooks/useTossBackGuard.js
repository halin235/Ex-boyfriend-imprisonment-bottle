import { useCallback, useEffect, useRef } from 'react'
import { trySubscribeTossBackEvent } from '../utils/tossBridge'

/**
 * 토스 미니앱 뒤로가기 방어 — 강제 종료 전 확인 모달
 */
export function useTossBackGuard({ enabled, onBackPress }) {
  const onBackRef = useRef(onBackPress)
  onBackRef.current = onBackPress

  const handleBack = useCallback(() => {
    onBackRef.current?.()
  }, [])

  useEffect(() => {
    if (!enabled) return undefined

    let tossUnsub = null
    let mounted = true

    trySubscribeTossBackEvent(() => {
      if (mounted) handleBack()
    }).then((unsub) => {
      if (mounted && typeof unsub === 'function') {
        tossUnsub = unsub
      }
    })

    window.history.pushState({ gameGuard: true }, '', window.location.href)

    const onPopState = () => {
      if (window.__allowTossFallbackBack === true) return
      window.history.pushState({ gameGuard: true }, '', window.location.href)
      handleBack()
    }

    window.addEventListener('popstate', onPopState)

    return () => {
      mounted = false
      if (typeof tossUnsub === 'function') {
        tossUnsub()
      }
      window.removeEventListener('popstate', onPopState)
    }
  }, [enabled, handleBack])
}
