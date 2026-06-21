/** 감정 고조 연출 시작 지점 (%) */
export const CRITICAL_GAUGE_START = 90

/**
 * 90~100% 구간 정규화 강도 (0~1)
 * @param {number} gauge
 * @param {boolean} [peak] — pre_burst 등 최대 강도 고정
 */
export function getCriticalIntensity(gauge, peak = false) {
  if (peak) return 1
  if (gauge < CRITICAL_GAUGE_START) return 0
  return Math.min(1, (gauge - CRITICAL_GAUGE_START) / (100 - CRITICAL_GAUGE_START))
}

/**
 * 감정 정리 정도 기반 동적 흔들림·빛 깜빡임 파라미터
 */
export function getCriticalShakeMotion(intensity) {
  if (intensity <= 0) {
    return null
  }

  const amplitude = 1.2 + intensity * 10
  const duration = 0.26 - intensity * 0.17
  const scalePulse = 0.008 + intensity * 0.028

  return {
    animate: {
      x: [0, -amplitude, amplitude, -amplitude * 0.88, amplitude * 0.88, 0],
      y: [0, amplitude * 0.35, -amplitude * 0.35, amplitude * 0.28, -amplitude * 0.28, 0],
      scale: [1, 1 + scalePulse, 1 - scalePulse * 0.85, 1 + scalePulse * 0.9, 1],
    },
    transition: {
      duration: Math.max(0.08, duration),
      repeat: Infinity,
      ease: 'linear',
    },
    rune: {
      pulseDuration: Math.max(0.12, 0.75 - intensity * 0.55),
      peakOpacity: 0.35 + intensity * 0.55,
      glowSpread: 8 + intensity * 32,
    },
  }
}
