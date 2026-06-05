import { useEffect, useRef } from 'react'
import { GAUGE_MARKS } from '../constants/expressionStages'
import { triggerGaugeMilestoneHaptic } from '../utils/haptics'

const PULSE_DURATION_MS = 100

/**
 * 게이지 25·50·75·100% 돌파 시 햅틱 + 시각 펄스 콜백
 * @param {number} gauge
 * @param {boolean} enabled
 * @param {(mark: number) => void} [onMilestonePulse] — JarComponent 미세 떨림 동기화
 */
export function useGaugeMilestoneHaptic(gauge, enabled = true, onMilestonePulse) {
  const crossedRef = useRef(new Set())
  const onPulseRef = useRef(onMilestonePulse)

  useEffect(() => {
    onPulseRef.current = onMilestonePulse
  }, [onMilestonePulse])

  useEffect(() => {
    if (!enabled) return

    for (const mark of GAUGE_MARKS) {
      if (gauge < mark) {
        crossedRef.current.delete(mark)
        continue
      }
      if (!crossedRef.current.has(mark)) {
        crossedRef.current.add(mark)
        const didVibrate = triggerGaugeMilestoneHaptic(mark)
        if (didVibrate) {
          onPulseRef.current?.(mark)
        }
      }
    }
  }, [gauge, enabled])
}

export { PULSE_DURATION_MS }
