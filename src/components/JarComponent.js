import { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BG_DEEP_MYSTERY } from '../constants/backgrounds'
import { getCriticalIntensity, getCriticalShakeMotion } from '../utils/criticalShake'

const MILESTONE_SHAKE = {
  x: [0, -2, 2, -1.5, 1.5, 0],
  y: [0, 1.5, -1.5, 1, -1, 0],
}

const SCENE_FILTER =
  'drop-shadow(0 0 10px rgba(0,0,0,0.5)) drop-shadow(0 0 15px rgba(128,0,128,0.25))'

export default function JarComponent({
  gauge = 0,
  expression,
  isResisting,
  isPreBurst,
  milestonePulse,
}) {
  const { id, src, ariaLabel } = expression
  const intensity = isPreBurst ? 1 : getCriticalIntensity(gauge)
  const isCritical = intensity > 0
  const criticalMotion = useMemo(
    () => getCriticalShakeMotion(intensity),
    [intensity],
  )

  const isPulsing = milestonePulse != null && !isPreBurst && !isCritical

  const jarAnimate = useMemo(() => {
    if (isCritical && criticalMotion) {
      return criticalMotion.animate
    }
    if (isResisting) {
      return {
        opacity: 1,
        y: 0,
        x: [0, -4, 4, -3, 3, 0],
        scale: 1,
      }
    }
    return { opacity: 1, y: 0, x: 0, scale: 1 }
  }, [isCritical, criticalMotion, isResisting])

  const jarTransition = useMemo(() => {
    if (isCritical && criticalMotion) {
      return criticalMotion.transition
    }
    if (isResisting) {
      return {
        opacity: { duration: 0.7, ease: 'easeOut' },
        y: { duration: 0.7, ease: 'easeOut' },
        x: { duration: 0.45, ease: 'easeInOut' },
      }
    }
    return {
      opacity: { duration: 0.7, ease: 'easeOut' },
      y: { duration: 0.7, ease: 'easeOut' },
    }
  }, [isCritical, criticalMotion, isResisting])

  const rune = criticalMotion?.rune

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[min(420px,90vw)] overflow-hidden rounded-2xl"
      style={{ backgroundColor: BG_DEEP_MYSTERY }}
      initial={{ opacity: 0, y: 24 }}
      animate={jarAnimate}
      transition={jarTransition}
    >
      {isCritical && rune && (
        <>
          <motion.div
            className="pointer-events-none absolute inset-[8%] z-[1] rounded-[32%]"
            animate={{
              boxShadow: [
                `0 0 ${rune.glowSpread}px rgba(168,85,247,${rune.peakOpacity * 0.35})`,
                `0 0 ${rune.glowSpread * 1.5}px rgba(236,72,255,${rune.peakOpacity})`,
                `0 0 ${rune.glowSpread}px rgba(192,132,252,${rune.peakOpacity * 0.3})`,
              ],
            }}
            transition={{
              duration: rune.pulseDuration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            aria-hidden
          />
          <motion.div
            className="pointer-events-none absolute left-1/2 top-[42%] z-[1] h-[28%] w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(147,51,234,0.3)_0%,transparent_68%)]"
            animate={{ opacity: [0.15, rune.peakOpacity * 0.65, 0.2, rune.peakOpacity * 0.75, 0.15] }}
            transition={{
              duration: rune.pulseDuration * 1.1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            aria-hidden
          />
        </>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={id}
          className="relative z-[2]"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          <motion.img
            key={isPulsing ? `pulse-${milestonePulse}` : 'idle'}
            src={src}
            alt={ariaLabel}
            role="img"
            className="block h-auto w-full select-none object-contain"
            style={{ filter: SCENE_FILTER }}
            animate={isPulsing ? MILESTONE_SHAKE : { x: 0, y: 0 }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
