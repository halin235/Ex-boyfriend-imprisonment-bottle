import { useCallback, useEffect, useState } from 'react'
import {
  getInitialMicUIState,
  markMicDismissed,
  markMicPromptSeen,
  markMicUsed,
  clearMicDismissedForRetry,
  queryMicPermissionOnce,
} from '../utils/micPermissionStorage'
import { debugLog } from '../utils/gameDebug'

/**
 * 마이크 권한 UI — localStorage + permissions.query 1회만 사용
 * getUserMedia는 사용자 버튼 탭 시에만 호출
 */
export function useMicPermissionGate() {
  const [showPermissionGate, setShowPermissionGate] = useState(
    () => getInitialMicUIState().showPermissionGate,
  )
  const [browseWithoutMic, setBrowseWithoutMic] = useState(
    () => getInitialMicUIState().browseWithoutMic,
  )
  const [permissionChecked, setPermissionChecked] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function syncFromBrowser() {
      const state = await queryMicPermissionOnce()
      if (cancelled) return

      const initial = getInitialMicUIState()

      if (initial.browseWithoutMic) {
        setShowPermissionGate(false)
        setBrowseWithoutMic(true)
      } else if (state === 'granted') {
        setShowPermissionGate(false)
        setBrowseWithoutMic(false)
      } else if (state === 'denied' && initial.showPermissionGate === false) {
        setShowPermissionGate(false)
        setBrowseWithoutMic(true)
      }

      setPermissionChecked(true)
      debugLog('마이크UI', 'permissions.query 동기화 완료', {
        browserState: state,
        showGate: initial.showPermissionGate,
        browseWithoutMic: initial.browseWithoutMic,
      })
    }

    syncFromBrowser()
    return () => {
      cancelled = true
    }
  }, [])

  const onDismiss = () => {
    markMicDismissed()
    setShowPermissionGate(false)
    setBrowseWithoutMic(true)
  }

  const onMicSuccess = () => {
    markMicUsed()
    setShowPermissionGate(false)
    setBrowseWithoutMic(false)
  }

  const onOpenGate = () => {
    markMicPromptSeen()
    clearMicDismissedForRetry()
    setShowPermissionGate(true)
    setBrowseWithoutMic(false)
  }

  const onFirstGateShown = useCallback(() => {
    markMicPromptSeen()
  }, [])

  return {
    showPermissionGate,
    browseWithoutMic,
    permissionChecked,
    onDismiss,
    onMicSuccess,
    onOpenGate,
    onFirstGateShown,
  }
}
