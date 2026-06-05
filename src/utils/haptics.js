/** 진동 쿨타임 — 토스 인앱 내 중복 햅틱 방지 (ms) */
const HAPTIC_COOLDOWN_MS = 100

/** 100% / 파괴 연출 — 항아리가 터지는 강렬한 타격감 */
export const DESTRUCTION_PATTERN = [40, 30, 40, 50, 100]

const MILESTONE_PATTERNS = {
  25: 25,
  50: 55,
  75: 90,
  100: DESTRUCTION_PATTERN,
}

let lastVibrateAt = 0

function canVibrate() {
  return typeof navigator !== 'undefined' && navigator.vibrate
}

/**
 * @param {number | number[]} pattern
 * @param {{ force?: boolean }} [options] — force: 쿨타임 무시 (파괴 연출 등)
 */
function safeVibrate(pattern, options = {}) {
  if (!canVibrate()) return false

  const now = Date.now()
  if (!options.force && now - lastVibrateAt < HAPTIC_COOLDOWN_MS) {
    return false
  }

  try {
    navigator.vibrate(pattern)
    lastVibrateAt = now
    return true
  } catch {
    return false
  }
}

function logHaptic(kind, mark, ok) {
  if (!import.meta.env.DEV || import.meta.env.VITE_GAME_DEBUG === 'false') return
  const label = mark != null ? `${mark}%` : kind
  console.log('[전남친항아리] 햅틱', label, ok ? 'vibrate' : 'skip')
}

/** 토스 인앱 파괴 연출 햅틱 */
export function triggerDestructionHaptic() {
  if (!canVibrate()) {
    logHaptic('destroy', null, false)
    return false
  }
  const ok = safeVibrate(DESTRUCTION_PATTERN, { force: true })
  logHaptic('destroy', null, ok)
  return ok
}

/** 게이지 구간(25·50·75·100%) 돌파 햅틱 */
export function triggerGaugeMilestoneHaptic(mark) {
  if (!canVibrate()) {
    logHaptic('milestone', mark, false)
    return false
  }
  const pattern = MILESTONE_PATTERNS[mark]
  if (pattern == null) return false
  const ok = safeVibrate(pattern)
  logHaptic('milestone', mark, ok)
  return ok
}
