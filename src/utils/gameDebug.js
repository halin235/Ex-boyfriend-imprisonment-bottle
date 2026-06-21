/**
 * 로컬 개발 전용 콘솔 디버그 (production build에서 tree-shake 가능)
 * VITE_GAME_DEBUG=false 로 비활성화
 */
import { CRITICAL_GAUGE_START } from './criticalShake'

const PREFIX = '[감정비우기]'

export function isGameDebugEnabled() {
  if (!import.meta.env.DEV) return false
  if (import.meta.env.VITE_GAME_DEBUG === 'false') return false
  return true
}

export function debugLog(category, message, data) {
  if (!isGameDebugEnabled()) return
  if (data !== undefined) {
    console.log(`${PREFIX} ${category}`, message, data)
  } else {
    console.log(`${PREFIX} ${category}`, message)
  }
}

/** RMS(0~1) → 대략적 dBFS (참고용, 캘리브레이션 전) */
export function rmsToApproxDb(rms) {
  const safe = Math.max(rms, 1e-8)
  return Math.round(20 * Math.log10(safe) * 10) / 10
}

let lastAudioLogAt = 0
const AUDIO_LOG_INTERVAL_MS = 400

export function debugAudioFrame({ rms, mode, displayLevel, gauge }) {
  if (!isGameDebugEnabled()) return
  const now = Date.now()
  if (now - lastAudioLogAt < AUDIO_LOG_INTERVAL_MS) return
  lastAudioLogAt = now

  console.log(`${PREFIX} 오디오`, {
    mode,
    rms: rms.toFixed(4),
    approxDbFS: rmsToApproxDb(rms),
    displayLevel: displayLevel.toFixed(2),
    gauge: gauge != null ? `${Math.round(gauge)}%` : undefined,
  })
}

let lastLoggedExpression = null
let criticalShakeLogged = false

export function debugGaugeState({ gauge, stageId, stageLabel, criticalIntensity }) {
  if (!isGameDebugEnabled()) return

  const rounded = Math.round(gauge)

  if (stageId !== lastLoggedExpression) {
    lastLoggedExpression = stageId
    debugLog('감정상태', `${stageLabel} (${stageId}) — 비워낸 정도 약 ${rounded}%`)
  }

  if (criticalIntensity > 0 && !criticalShakeLogged) {
    criticalShakeLogged = true
    debugLog(
      '감정고조',
      `비워낸 정도 ${CRITICAL_GAUGE_START}%+ — 마무리 연출 시작 (intensity=${criticalIntensity.toFixed(2)})`,
    )
  }

  if (gauge < CRITICAL_GAUGE_START) {
    criticalShakeLogged = false
  }
}

export function debugMilestone(mark, vibrated) {
  debugLog('정리단계', `${mark}% 도달`, { haptic: vibrated ? 'vibrate OK' : 'vibrate skip' })
}

export function debugAutoDestroy() {
  debugLog('마무리', '비워낸 정도 100% → ending.mp4 자동 재생')
}

export function resetGameDebugSession() {
  lastLoggedExpression = null
  criticalShakeLogged = false
  lastAudioLogAt = 0
}
